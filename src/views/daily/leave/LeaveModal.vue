<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :destroyOnClose="true"
    :okText="t('daily.leave.modal.saveText')"
    @ok="handleSave"
  >
    <template #title>
      <div>
        <!-- tag -->
        <Tag v-if="isUpdate" :color="tagInfo.color"> {{ tagInfo.text }} </Tag>

        <!-- title text -->
        <span>{{ order === '' ? t('daily.leave.modal.addLeave') : order }}</span>

        <!-- 撤銷按鈕 -->
        <Popconfirm
          v-if="isUpdate"
          placement="bottom"
          title="Are you sure？"
          ok-text="Yes"
          cancel-text="No"
          @confirm="handleDelete"
        >
          <Button v-if="isUpdate" type="primary" class="ml-2" danger size="small" shape="round">
            <DeleteOutlined />
            <span>{{ t('daily.leave.modal.deleteText') }}</span>
          </Button>
        </Popconfirm>
      </div>
    </template>

    <BasicForm @register="registerForm" :disabled="disabled">
      <template #proxy="{ model, field }">
        <!-- 代理人選擇 -->
        <ProxyPicker
          ref="ProxyPickerRef"
          v-model:employee-id="model[field]"
          :disabled="disabled"
          width="150px"
        />
      </template>

      <template #leave="{ model, field }">
        <!-- 假別選擇 -->
        <LeavePicker
          ref="LeavePickerRef"
          v-model:id="model[field]"
          v-model:minimum="leaveMinimum"
          width="150px"
          :disabled="disabled"
        />
      </template>

      <template #date="{ model, field }">
        <!-- 日期區間 -->
        <RangePicker v-model:value="model[field]" valueFormat="YYYY-MM-DD" :allowClear="false" />
      </template>

      <template #attach="{ model, field }">
        <!-- 上傳附件 -->
        <BasicUpload
          v-model:value="model[field]"
          :maxNumber="10"
          :maxSize="20"
          :api="uploadApi"
          :multiple="true"
          :disabled="disabled"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { useModalInner, BasicModal } from '@/components/Modal';
  import { useForm, BasicForm } from '@/components/Form';
  import { leaveFormSchema } from '@/views/daily/leave/leave.data';
  import { reactive, ref, unref } from 'vue';
  import { ProxyPicker } from './components/ProxyPicker';
  import { LeavePicker } from './components/LeavePicker';
  import { BasicUpload } from '@/components/Upload';
  import { uploadApi } from '@/api/sys/upload';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import dayjs from 'dayjs';
  import { deleteLeaveForm, saveLeaveForm } from '@/api/daily/leave';
  import { LeaveBasicForm, LeaveRequestFormModel, SignStatus } from '@/api/daily/model/leaveModel';
  import { RangePicker, Popconfirm, Tag, Button } from 'ant-design-vue';

  const emit = defineEmits(['success', 'register', 'delete']);
  const { createConfirm } = useMessage();
  const { t } = useI18n();

  //-是否為更新
  const isUpdate = ref(true);

  //-tag info
  const tagInfo = reactive({ color: '', text: '' });

  //-簽核中狀態下卡控所有欄位禁止更動
  const disabled = ref(false);

  //-ProxyPicker ref
  const ProxyPickerRef = ref();

  //-LeavePicker ref
  const LeavePickerRef = ref();

  //-當前表單id
  const id = ref(0);

  //-當前表單單號
  const order = ref('');

  //-請假最低分鐘數
  const leaveMinimum = ref(0);

  //-原始最低分鐘數
  const originMinimum = ref<number>();

  //-form註冊
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: leaveFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  //-modal入口
  const [registerModal, { setModalProps, closeModal, changeLoading }] = useModalInner(
    async (data: { isUpdate: boolean; disabled: boolean; record: LeaveRequestFormModel }) => {
      //-reset
      setModalProps({ confirmLoading: false });
      resetFields();
      reset();

      //-判斷狀態
      isUpdate.value = !!data?.isUpdate;
      disabled.value = !!data?.disabled;

      if (unref(isUpdate)) {
        id.value = data.record.ID;
        order.value = data.record.order!;
        originMinimum.value = data.record.leave?.minimum;
        ProxyPickerRef.value.setRealName(data.record.proxyEmployee?.realName);
        LeavePickerRef.value.setName(data.record.leave?.name);

        setTag(data.record.signStatus!);
        setFieldsValue({
          ...formatForm(data.record),
        });
      }
    },
  );

  /**
   * @description 設定tag
   * @param signStatus
   */
  const setTag = (signStatus: SignStatus) => {
    switch (signStatus) {
      case SignStatus.SignStatusSending:
        tagInfo.color = '#D0D0D0';
        tagInfo.text = t('daily.global.sending');
        break;
      case SignStatus.SignStatusSigning:
        tagInfo.color = '#FF5809';
        tagInfo.text = t('daily.global.signing');
        break;
      case SignStatus.SignStatusApprove:
        tagInfo.color = '#00EC00';
        tagInfo.text = t('daily.global.approve');
        break;
      case SignStatus.SignStatusReject:
        tagInfo.color = '#EA0000';
        tagInfo.text = t('daily.global.reject');
        break;
    }
  };

  /**
   * @description 儲存
   */
  const handleSave = async () => {
    setModalProps({ confirmLoading: true });

    if (unref(disabled)) {
      closeModal();
      return;
    }

    try {
      const form = await validate();
      if (form) {
        //-寫入ID
        form.ID = id.value;

        //-時間判斷，是否有超過最低表準
        if (timeJudge(form.date!, [form.startTime!, form.endTime!])) {
          const res = await saveLeaveForm(form as LeaveBasicForm);
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), result: res });
        } else {
          //-假設沒超過最低要求，提醒使用者
          const Minimum = leaveMinimum.value || originMinimum.value;
          createConfirm({
            iconType: 'warning',
            title: t('daily.global.warning'),
            content: t('daily.leave.modal.minimumWarning').replaceAll('#', String(Minimum)),
            onOk: async () => {
              const res = await saveLeaveForm(form as LeaveBasicForm);
              closeModal();
              emit('success', { isUpdate: unref(isUpdate), result: res });
            },
          });
        }
      }
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };

  /**
   * @description 刪除請假單
   */
  const handleDelete = async () => {
    changeLoading(true);
    deleteLeaveForm(id.value)
      .then(() => {
        closeModal();
        emit('delete', { order: order.value });
      })
      .finally(() => changeLoading(false));
  };

  /**
   * @description 時間判斷，是否有超過最低表準
   * @param date 日期區間
   * @param time 時間區間
   */
  const timeJudge = (date: string[], time: string[]) => {
    const d1 = dayjs(date[0], 'YYYY-MM-DD');
    const d2 = dayjs(date[1], 'YYYY-MM-DD');
    const t1 = dayjs(time[0], 'HH:mm');
    const t2 = dayjs(time[1], 'HH:mm');

    const diffMins = t2.diff(t1, 'minute'); //-計算兩個時間相差多少
    const diffDays = d2.diff(d1, 'day') + 1; //-計算相差多少天

    const Minimum = leaveMinimum.value || originMinimum.value;

    return Math.abs(diffMins) * diffDays > Minimum!;
  };

  /**
   * @description 重置
   */
  const reset = () => {
    id.value = 0;
    order.value = '';
    originMinimum.value = undefined;
    ProxyPickerRef.value.clear();
    LeavePickerRef.value.clear();
  };

  /**
   * @description LeaveRequestFormModel => LeaveBasicForm
   * @param record LeaveRequestFormModel
   */
  const formatForm = (record: LeaveRequestFormModel): LeaveBasicForm => {
    return {
      proxyEmployeeId: record.proxyEmployeeId,
      leaveId: record.leaveId,
      date: [record.startDate!, record.endDate!],
      startTime: record.startTime,
      endTime: record.endTime,
      attach: record.attach ? record.attach?.split(',') : [],
      remark: record.remark,
    };
  };
</script>
