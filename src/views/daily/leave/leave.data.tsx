import { BasicColumn, FormSchema } from '@/components/Table';
import { Tag } from 'ant-design-vue';
import { useI18n } from '@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { SignStatus } from '@/api/daily/model/leaveModel';

const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: t('daily.leave.signStatusTitle'),
    width: 80,
    customRender: ({ record }) => {
      const signStatus = record.signStatus;
      let color: string = '';
      let text: string = '';
      switch (signStatus) {
        case SignStatus.SignStatusSending:
          color = '#D0D0D0';
          text = t('daily.global.sending');
          break;
        case SignStatus.SignStatusSigning:
          color = '#FF5809';
          text = t('daily.global.signing');
          break;
        case SignStatus.SignStatusApprove:
          color = '#00EC00';
          text = t('daily.global.approve');
          break;
        case SignStatus.SignStatusReject:
          color = '#EA0000';
          text = t('daily.global.reject');
          break;
      }
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: t('daily.leave.orderTitle'),
    width: 150,
    customRender: ({ record }) => {
      return record.order;
    },
  },
  {
    title: t('daily.leave.createdAtTitle'),
    width: 100,
    customRender: ({ record }) => {
      const date = dayjs(record.createdAt);
      return date.format('YYYY-MM-DD');
    },
  },
  {
    title: t('daily.leave.leaveCoreNameTitle'),
    width: 100,
    customRender: ({ record }) => {
      return record.leave.name;
    },
  },
  // {
  //   title: t('daily.leave.departmentNameTitle'),
  //   width: 100,
  //   customRender: ({ record }) => {
  //     return record.department.name;
  //   },
  // },
  {
    title: t('daily.leave.dateTitle'),
    width: 200,
    customRender: ({ record }) => {
      return `${record.startDate} ~ ${record.endDate}`;
    },
  },
  {
    title: t('daily.leave.timeTitle'),
    width: 200,
    customRender: ({ record }) => {
      return `${record.startTime} ~ ${record.endTime}`;
    },
  },
  {
    title: t('daily.leave.leaveMinuteCountTitle'),
    width: 90,
    customRender: ({ record }) => {
      return record.leaveMinuteCount;
    },
  },
  {
    title: t('daily.leave.leaveHourCountTitle'),
    width: 80,
    customRender: ({ record }) => {
      return record.leaveHourCount;
    },
  },
  {
    title: t('daily.leave.leaveDayCountTitle'),
    width: 80,
    customRender: ({ record }) => {
      return record.leaveDayCount;
    },
  },
  {
    title: t('daily.leave.remarkTitle'),
    customRender: ({ record }) => {
      return record.remark;
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'dateRange',
    label: t('daily.leave.dateTitle'),
    component: 'RangePicker',
    colProps: { span: 12 },
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
];

export const leaveFormSchema: FormSchema[] = [
  {
    field: 'proxyEmployeeId',
    label: t('daily.leave.proxyTitle'),
    required: true,
    slot: 'proxy',
    componentProps: {
      style: { width: '180px' },
    },
  },
  {
    field: 'leaveId',
    label: t('daily.leave.leaveCoreNameTitle'),
    required: true,
    slot: 'leave',
    componentProps: {
      style: { width: '250px' },
    },
  },
  {
    field: 'date',
    label: t('daily.leave.dateTitle'),
    defaultValue: [],
    required: true,
    slot: 'date',
  },
  {
    field: 'startTime',
    label: '開始時間',
    component: 'TimePicker',
    required: true,
    componentProps: {
      valueFormat: 'HH:mm:ss',
      format: 'HH:mm:ss',
      placeholder: 'Start time',
      allowClear: false,
    },
  },
  {
    field: 'endTime',
    label: '結束時間',
    component: 'TimePicker',
    required: true,
    componentProps: {
      valueFormat: 'HH:mm:ss',
      format: 'HH:mm:ss',
      placeholder: 'End time',
      allowClear: false,
    },
  },
  {
    field: 'attach',
    label: t('daily.leave.attachTitle'),
    defaultValue: [],
    slot: 'attach',
  },
  {
    field: 'remark',
    label: t('daily.leave.remarkTitle'),
    component: 'InputTextArea',
    componentProps: {
      rows: 6,
    },
  },
];
