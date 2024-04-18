<script setup lang="ts">
  import { BasicModal, useModalInner } from '@/components/Modal';
  import {
    CheckInBasicForm,
    CheckInRequestFormModel,
    CheckInType,
  } from '@/api/daily/model/checkInModel';
  import { SignStatus } from '@/api/daily/model/leaveModel';
  import { reactive, ref, unref } from 'vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { DeleteOutlined, PlusCircleOutlined, CloseOutlined } from '@ant-design/icons-vue';
  import {
    Button,
    Popconfirm,
    Tag,
    DatePicker,
    TimePicker,
    Input,
    Select,
    Divider,
    SelectProps,
    FormItem,
    Row,
    Col,
  } from 'ant-design-vue';
  import { BasicUpload } from '@/components/Upload';
  import { uploadApi } from '@/api/sys/upload';
  import { BasicForm, useForm } from '@/components/Form';
  import { checkInFormSchema } from '@/views/daily/check-in/checkIn.data';
  import dayjs from 'dayjs';
  import { useDesign } from '@/hooks/web/useDesign';
  import { deleteCheckInForm, saveCheckInForm } from '@/api/daily/checkIn';
  import { useMessage } from '@/hooks/web/useMessage';

  const emit = defineEmits(['success', 'register', 'delete']);
  const { prefixCls } = useDesign('check-in-modal');
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

  //-打卡狀態options
  const checkInTypeOptions = ref<SelectProps['options']>([
    {
      value: CheckInType.Work,
      label: '上班',
    },
    {
      value: CheckInType.OffWork,
      label: '下班',
    },
  ]);

  //-form註冊
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    baseColProps: { span: 24 },
    schemas: checkInFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  //-modal入口
  const [registerModal, { setModalProps, closeModal, changeLoading }] = useModalInner(
    async (data: { isUpdate: boolean; disabled: boolean; record: CheckInRequestFormModel }) => {
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
   * @description 刪除補打卡單
   */
  const handleDelete = async () => {
    changeLoading(true);
    deleteCheckInForm(id.value)
      .then(() => {
        closeModal();
        emit('delete', { order: order.value });
      })
      .finally(() => changeLoading(false));
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
      const result: CheckInBasicForm = await validate();
      //-寫入ID
      result.id = id.value;

      if (!result.detail || result.detail?.length === 0) {
        useMessage().createErrorModal({ title: '錯誤', content: '請填寫至少一筆明細' });
        return;
      }

      //-api
      saveCheckInForm(result).then((res) => {
        closeModal();
        emit('success', { isUpdate: unref(isUpdate), result: res });
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };

  /**
   * @description CheckInRequestFormModel => CheckInBasicForm
   * @param record CheckInRequestFormModel
   */
  const formatForm = (record: CheckInRequestFormModel): CheckInBasicForm => {
    return {
      attach: record.attach ? record.attach?.split(',') : [],
      remark: record.remark,
      detail: record.detail,
    };
  };

  /**
   * @description 新增明細
   * @param detail
   */
  const handleAdd = (detail) => {
    detail.push({
      date: dayjs().format('YYYY-MM-DD'),
      time: '08:00:00',
      checkInType: CheckInType.Work,
      remark: '',
    });
  };

  /**
   * @description 點擊刪除年資
   * @param detail
   * @param index
   */
  const handleRemove = (detail: any[], index: number) => {
    detail.splice(index, 1);
  };
</script>

<template>
  <BasicModal
    :class="prefixCls"
    v-bind="$attrs"
    @register="registerModal"
    :destroyOnClose="true"
    :height="500"
    :minHeight="500"
    :okText="t('daily.leave.modal.saveText')"
    @ok="handleSave"
  >
    <template #title>
      <div>
        <!-- tag -->
        <Tag v-if="isUpdate" :color="tagInfo.color"> {{ tagInfo.text }} </Tag>

        <!-- title text -->
        <span>{{ order === '' ? '新增補打卡單' : order }}</span>

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

    <!-- form -->
    <BasicForm @register="registerForm" :disabled="disabled">
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

      <template #detail="{ model, field }">
        <!-- 明細form -->
        <template v-for="(item, index) in model[field] as any[]" :key="`${index}-detail`">
          <div style="width: 100%">
            <Tag>{{ `明細${index + 1}` }}</Tag>
          </div>

          <div :class="`${prefixCls}-detail-form-item`" style="display: flex; flex-direction: row">
            <Divider type="vertical" />

            <div style="display: flex; flex-direction: column">
              <Row>
                <Col>
                  <!-- 日期選擇 -->
                  <FormItem label="日期" :name="`date_${index}`">
                    <DatePicker
                      v-model:value="item.date"
                      size="small"
                      :allowClear="false"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                    />
                  </FormItem>
                </Col>

                <Col>
                  <!-- 時間選擇 -->
                  <FormItem class="ml-3" label="時間" :name="`time_${index}`">
                    <TimePicker
                      v-model:value="item.time"
                      size="small"
                      :allowClear="false"
                      format="HH:mm:ss"
                      value-format="HH:mm:ss"
                    />
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col>
                  <!-- 狀態 -->
                  <FormItem label="狀態" :name="`checkInType_${index}`">
                    <Select
                      v-model:value="item.checkInType"
                      :options="checkInTypeOptions"
                      size="small"
                      style="width: 80px"
                    />
                  </FormItem>
                </Col>

                <Col>
                  <!-- 原因 -->
                  <FormItem class="ml-2" label="原因">
                    <Input v-model:value="item.remark" size="small" style="width: 165px" />
                  </FormItem>
                </Col>
              </Row>
            </div>

            <!-- 刪除明細 -->
            <div class="ml-3" style="display: flex; align-items: center">
              <Button
                v-show="!disabled"
                type="text"
                danger
                @click="handleRemove(model[field], index)"
              >
                <template #icon>
                  <CloseOutlined />
                </template>
              </Button>
            </div>
          </div>
        </template>

        <!-- 新增明細按鈕 -->
        <Button
          v-show="!disabled"
          type="link"
          style="font-size: 14px"
          @click="handleAdd(model[field])"
        >
          <template #icon>
            <PlusCircleOutlined />
          </template>
          新增明細
        </Button>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<style scoped lang="less">
  @prefix-cls: ~'@{namespace}-check-in-modal';

  .@{prefix-cls} {
    &-detail-form-item {
      margin-top: 6px;
      font-weight: bold;

      span {
        margin-right: 8px;
      }

      .ant-form-item {
        margin-bottom: 0;
      }

      .ant-divider {
        width: 4px;
        height: 60px;
        background-color: @border-color-base;
      }
    }
  }
</style>
