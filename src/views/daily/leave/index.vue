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
          {{ t('daily.leave.addLeave') }}
        </Button>
      </template>
    </BasicTable>

    <LeaveModal @register="registerModal" @success="handleSucc" @delete="handleDeleteSucc" />
  </div>
</template>

<script setup lang="ts">
  import { BasicTable, useTable } from '@/components/Table';
  import { reactive, ref, onMounted } from 'vue';
  import { columns, searchFormSchema } from './leave.data';
  import { getLeaveFormByEmployee } from '@/api/daily/leave';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useModal } from '@/components/Modal';
  import LeaveModal from './LeaveModal.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    GetLeaveFormByEmployeeParams,
    LeaveRequestFormModel,
  } from '@/api/daily/model/leaveModel';
  import { Button } from 'ant-design-vue';

  defineOptions({
    name: 'LeaveDaily',
    inheritAttrs: false,
  });

  const { prefixCls } = useDesign('leave-form');
  const { createMessage } = useMessage();
  const { t } = useI18n();

  //-loading
  const loading = ref(false);

  //-搜尋條件
  const searchInfo = reactive<Recordable>({});

  //-LeaveModal註冊
  const [registerModal, { openModal }] = useModal();

  //-table設定
  const [registerTable, { reload }] = useTable({
    title: t('daily.leave.leaveTitle'),
    api: getLeaveFormByEmployee,
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
  const onRowClick = async (record: LeaveRequestFormModel) => {
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

  onMounted(() => {
    // searchInfo.dateRange = [dayjs(), dayjs()];
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-leave-form';

  .@{prefix-cls} {
    &-table {
      .ant-table-row {
        cursor: pointer;
      }
    }
  }
</style>
