import { BasicColumn, FormSchema } from '@/components/Table';
import { SignStatus } from '@/api/daily/model/leaveModel';
import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

export const columns: BasicColumn[] = [
  {
    title: '狀態',
    width: 80,
    customRender: ({ record }) => {
      const signStatus = record.signStatus;
      let color: string = '';
      let text: string = '';
      switch (signStatus) {
        case SignStatus.SignStatusSending:
          color = '#D0D0D0';
          text = '送簽中';
          break;
        case SignStatus.SignStatusSigning:
          color = '#FF5809';
          text = '簽核中';
          break;
        case SignStatus.SignStatusApprove:
          color = '#00EC00';
          text = '核准';
          break;
        case SignStatus.SignStatusReject:
          color = '#EA0000';
          text = '駁回';
          break;
      }
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: '單號',
    width: 150,
    customRender: ({ record }) => {
      return record.order;
    },
  },
  {
    title: '建立時間',
    width: 100,
    customRender: ({ record }) => {
      const date = dayjs(record.CreatedAt);
      return date.format('YYYY-MM-DD');
    },
  },
  {
    title: '補打卡筆數',
    width: 200,
    customRender: ({ record }) => {
      if (!record.detail) {
        return '0筆';
      }
      return `${record.detail.length}筆`;
    },
  },
  {
    title: '備註',
    customRender: ({ record }) => {
      return record.remark;
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'dateRange',
    label: '日期區間',
    component: 'RangePicker',
    colProps: { span: 12 },
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
];

export const checkInFormSchema: FormSchema[] = [
  {
    field: 'attach',
    label: '附件',
    defaultValue: [],
    slot: 'attach',
  },
  {
    field: 'remark',
    label: '備註',
    component: 'InputTextArea',
    componentProps: {
      rows: 6,
    },
  },
  {
    field: '',
    label: '明細',
    component: 'Divider',
    componentProps: {
      style: { 'font-weight': 'bold', 'font-size': '16px' },
    },
  },
  {
    field: 'detail',
    defaultValue: [],
    slot: 'detail',
  },
];
