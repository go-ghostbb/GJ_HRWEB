<template>
  <BasicModal
    v-bind="$attrs"
    title="人員列表"
    @register="registerModal"
    :minHeight="350"
    width="700px"
    :footer="null"
    :destroyOnClose="true"
  >
    <BasicTable :class="`${prefixCls}-table`" @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <AButton @click="handleGet(record as EmployeeModel)">{{ '取回' }}</AButton>
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { getEmployeeByKeyword } from '@/api/database/employee/employee';
  import {
    EmployeeModel,
    GetEmployeeByKeywordParams,
  } from '@/api/database/employee/model/employeeModel';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicTable, useTable } from '@/components/Table';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useEmployeeStore } from '@/store/modules/employee';

  const emit = defineEmits(['success', 'register']);

  const { prefixCls } = useDesign('department-user-picker-modal');

  //-modal初始化
  const [registerModal, { closeModal }] = useModalInner(async (_data) => {});

  //-table設定
  const [registerTable] = useTable({
    api: getEmployeeByKeyword,
    beforeFetch: (params: GetEmployeeByKeywordParams) => {
      params.employmentStatus = 'active';
      return params;
    },
    afterFetch: (record: EmployeeModel[]) => {
      const employeeInfo = useEmployeeStore().getEmployeeInfo;

      //-代理人不能是自己，所以必須刪掉
      for (let i = 0; i < record.length; i++) {
        if (record[i].ID === employeeInfo.employeeId) {
          record.splice(i, 1);
          break;
        }
      }

      return record;
    },
    columns: [
      {
        title: '人員',
        dataIndex: 'realName',
        width: 200,
      },
      {
        title: '信箱',
        dataIndex: 'email',
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
          field: 'realName',
          label: '名字',
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
  const handleGet = (record: EmployeeModel) => {
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
