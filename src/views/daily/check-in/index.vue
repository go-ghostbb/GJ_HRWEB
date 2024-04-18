<script setup lang="ts">
  import { useDesign } from '@/hooks/web/useDesign';
  import { useMessage } from '@/hooks/web/useMessage';
  import { reactive, ref } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { GetLeaveFormByEmployeeParams } from '@/api/daily/model/leaveModel';
  import { columns, searchFormSchema } from './checkIn.data';
  import { CheckInRequestFormModel } from '@/api/daily/model/checkInModel';
  import { useI18n } from '@/hooks/web/useI18n';
  import { Button } from 'ant-design-vue';
  import { getCheckInFormByEmployee } from '@/api/daily/checkIn';
  import { useModal } from '@/components/Modal';
  import CheckInModal from './CheckInModal.vue';

  defineOptions({
    name: 'CheckInDaily',
    inheritAttrs: false,
  });

  const { prefixCls } = useDesign('check-in-form');
  const { createMessage } = useMessage();
  const { t } = useI18n();

  //-loading
  const loading = ref(false);

  //-搜尋條件
  const searchInfo = reactive<Recordable>({});

  //-CheckInModal註冊
  const [registerModal, { openModal }] = useModal();

  //-table設定
  const [registerTable, { reload }] = useTable({
    title: '補打卡單列表',
    api: getCheckInFormByEmployee,
    beforeFetch: (params) => {
      if (!params.dateRange) {
        return params;
      }
      if (typeof params.dateRange[0] !== 'string') {
        //-如果不是字串的，代表型態為Dayjs，把他轉為字串
        params.dateRange[0] = params.dateRange[0].format('YYYY-MM-DD');
        params.dateRange[1] = params.dateRange[1].format('YYYY-MM-DD');
      }

      const newParams: GetLeaveFormByEmployeeParams = {
        page: params.page,
        pageSize: params.pageSize,
        startDate: params.dateRange[0],
        endDate: params.dateRange[1],
      };

      return newParams;
    },
    rowKey: 'id',
    columns,
    formConfig: {
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    ellipsis: false,
    useSearchForm: true,
    showTableSetting: true,
    showIndexColumn: false,
    bordered: true,
  });

  /**
   * @description 當row被點擊
   * @param record LeaveForm
   */
  const onRowClick = async (record: CheckInRequestFormModel) => {
    openModal(true, { record: record, isUpdate: true, disabled: !(record.signStatus === 0) });
  };

  /**
   * @description 成功
   * @param param
   */
  const handleSucc = ({ isUpdate, result }) => {
    if (isUpdate) {
      createMessage.success(t('daily.leave.updateSucc').replaceAll('#', result.order));
    } else {
      createMessage.success(t('daily.leave.addSucc').replaceAll('#', result.order));
    }
    reload();
  };

  /**
   * @description 點擊刪除成功
   * @param param
   */
  const handleDeleteSucc = ({ order }) => {
    createMessage.success(t('daily.leave.deleteSucc').replaceAll('#', order));
    reload();
  };
</script>

<template>
  <div v-loading="loading">
    <BasicTable
      :class="`${prefixCls}-table`"
      @register="registerTable"
      :searchInfo="searchInfo"
      :striped="false"
      @row-click="onRowClick"
    >
      <template #toolbar>
        <Button type="primary" @click="openModal(true, { isUpdate: false })">
          {{ '新增補打卡單' }}
        </Button>
      </template>
    </BasicTable>

    <CheckInModal @register="registerModal" @success="handleSucc" @delete="handleDeleteSucc" />
  </div>
</template>

<style lang="less">
  @prefix-cls: ~'@{namespace}-check-in-form';

  .@{prefix-cls} {
    &-table {
      .ant-table-row {
        cursor: pointer;
      }
    }
  }
</style>
