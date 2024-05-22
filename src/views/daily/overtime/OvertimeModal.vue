<script setup lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import { reactive, ref, unref } from 'vue';
  import { overtimeFormSchema } from '@/views/daily/overtime/overtime.data';
  import { BasicForm, useForm } from '@/components/Form';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { SignStatus } from '@/api/daily/model/leaveModel';
  import { OvertimeBasicForm, OvertimeRequestFormModel } from '@/api/daily/model/overtimeModel';
  import { deleteOvertimeForm, saveOvertimeForm } from '@/api/daily/overtime';
  import { Button, Popconfirm, Tag } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';

  const emit = defineEmits(['success', 'register', 'delete']);
  const { t } = useI18n();

  //-tag info
  const tagInfo = reactive({ color: '', text: '' });

  //-是否為更新
  const isUpdate = ref(true);

  //-簽核中狀態下卡控所有欄位禁止更動
  const disabled = ref(false);

  //-當前表單id
  const id = ref(0);

  //-當前表單單號
  const order = ref('');

  //-form註冊
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: overtimeFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  //-modal入口
  const [registerModal, { setModalProps, closeModal, changeLoading }] = useModalInner(
    async (data: { isUpdate: boolean; disabled: boolean; record: OvertimeRequestFormModel }) => {
      //-reset
      setModalProps({ confirmLoading: false });
      resetFields();

      isUpdate.value = !!data?.isUpdate;
      disabled.value = !!data?.disabled;
      order.value = '';
      id.value = 0;

      if (unref(isUpdate)) {
        id.value = data.record.ID;
        order.value = data.record.order!;
        setTag(data.record.signStatus!);

        setFieldsValue({
          ...data.record,
        });
      }
    },
  );

  /**
   * @description 刪除補打卡單
   */
  const handleDelete = async () => {
    changeLoading(true);
    deleteOvertimeForm(id.value)
      .then(() => {
        closeModal();
        emit('delete', { order: order.value });
      })
      .finally(() => changeLoading(false));
  };

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
    if (unref(disabled)) {
      closeModal();
      return;
    }
    try {
      setModalProps({ confirmLoading: true });

      //-驗證表單
      const result: OvertimeBasicForm = await validate();
      //-寫入ID
      result.id = id.value;

      //-api
      const res = saveOvertimeForm(result);
      closeModal();
      emit('success', { isUpdate: unref(isUpdate), result: res });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };
</script>

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
        <span>{{ order === '' ? '新增加班單' : order }}</span>

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

    <!-- Form -->
    <BasicForm @register="registerForm" :disabled="disabled" />
  </BasicModal>
</template>

<style scoped lang="less"></style>
