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
    title: '加班日期',
    width: 200,
    customRender: ({ record }) => {
      return record.date;
    },
  },
  {
    title: '加班時間',
    width: 200,
    customRender: ({ record }) => {
      return `${record.startTime} ~ ${record.endTime}`;
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

export const overtimeFormSchema: FormSchema[] = [
  {
    field: 'date',
    label: '日期',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    field: 'startTime',
    label: '開始時間',
    component: 'TimePicker',
    componentProps: {
      valueFormat: 'HH:mm:ss',
    },
  },
  {
    field: 'endTime',
    label: '結束時間',
    component: 'TimePicker',
    componentProps: {
      valueFormat: 'HH:mm:ss',
    },
  },
  {
    field: 'remark',
    label: '備註',
    component: 'InputTextArea',
    componentProps: {
      rows: 6,
    },
  },
];
