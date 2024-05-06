<script setup lang="ts">
  import { useTable, BasicTable } from '@/components/Table';
  import { getByDateRangeCheckInStatus } from '@/api/query/checkIn';
  import { column, searchFormSchema } from './data';

  defineOptions({
    name: 'CheckInQuery',
    inheritAttrs: false,
  });

  //-table設定
  const [registerTable] = useTable({
    title: '出缺勤列表',
    api: getByDateRangeCheckInStatus,
    columns: column,
    formConfig: {
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    pagination: false,
    immediate: false,
  });
</script>

<template>
  <BasicTable @register="registerTable" />
</template>

<style scoped lang="less"></style>
