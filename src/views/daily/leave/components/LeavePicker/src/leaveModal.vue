<template>
  <BasicModal
    v-bind="$attrs"
    title="假別列表"
    @register="registerModal"
    :minHeight="350"
    width="700px"
    :footer="null"
    :destroyOnClose="true"
  >
    <BasicTable :class="`${prefixCls}-table`" @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <AButton @click="handleGet(record as LeaveModel)">{{ '取回' }}</AButton>
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { getLeaveByKeyword } from '@/api/database/leave/leave';
  import { LeaveModel } from '@/api/database/leave/model/leaveModel';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicTable, useTable } from '@/components/Table';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useI18n } from '@/hooks/web/useI18n';

  const emit = defineEmits(['success', 'register']);

  const { t } = useI18n();

  const { prefixCls } = useDesign('department-user-picker-modal');

  //-modal初始化
  const [registerModal, { closeModal }] = useModalInner(async (_data) => {});

  //-table設定
  const [registerTable] = useTable({
    api: getLeaveByKeyword,
    columns: [
      {
        title: t('daily.leave.components.LeaveCorePicker.Modal.nameTitle'),
        dataIndex: 'name',
        width: 200,
      },
      {
        title: t('daily.leave.components.LeaveCorePicker.Modal.remarkTitle'),
        dataIndex: 'remark',
        width: 200,
      },
    ],
    showIndexColumn: false,
    showTableSetting: false,
    useSearchForm: true,
    resizeHeightOffset: 80,
    formConfig: {
      schemas: [
        {
          field: 'name',
          label: t('daily.leave.components.LeaveCorePicker.Modal.nameTitle'),
          component: 'Input',
          colProps: { span: 8 },
        },
      ],
      autoSubmitOnEnter: true,
    },
    actionColumn: {
      width: 80,
      title: '',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
      fixed: undefined,
    },
  });

  /**
   * @description 點擊取回事件
   * @param record employee
   */
  const handleGet = (record: LeaveModel) => {
    emit('success', record);
    closeModal();
  };
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-department-user-picker-modal';

  .@{prefix-cls} {
    &-table {
      .ant-form {
        border: #bebebe solid 1px;
      }

      .ant-table-wrapper {
        border: #bebebe solid 1px;
      }
    }
  }
</style>
