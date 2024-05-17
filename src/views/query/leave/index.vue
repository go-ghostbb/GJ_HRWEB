<script setup lang="ts">
  import { BasicTable, useTable } from '@/components/Table';
  import { getLeaveCorrect } from '@/api/query/leave';
  import { column, searchFormSchema } from './data';

  defineOptions({
    name: 'LeaveCorrectQuery',
    inheritAttrs: false,
  });

  //-table設定
  const [registerTable] = useTable({
    title: '假別列表',
    api: getLeaveCorrect,
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
  });
</script>

<template>
  <BasicTable @register="registerTable" />
</template>

<style scoped lang="less"></style>
