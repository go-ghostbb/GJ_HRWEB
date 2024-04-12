import { DescItem } from '@/components/Description';
import { BasicColumn } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();

export const infoDescSchema: DescItem[] = [
  {
    field: 'order',
    label: t('signOff.overtime.orderTitle'),
  },
  {
    field: 'createdAt',
    label: t('signOff.overtime.createdAtTitle'),
  },
  {
    field: 'user',
    label: t('signOff.overtime.userTitle'),
  },
  {
    field: 'department',
    label: t('signOff.overtime.departmentTitle'),
  },
  {
    field: 'remark',
    label: t('signOff.overtime.remarkTitle'),
  },
];

export const detailDescSchema: DescItem[] = [
  {
    field: 'type',
    label: t('signOff.overtime.typeTitle'),
    render: (val, _record) => {
      return <div>{val.typeName}</div>;
    },
  },
  {
    field: 'startTime',
    label: t('signOff.overtime.startTimeTitle'),
  },
  {
    field: 'endTime',
    label: t('signOff.overtime.endTimeTitle'),
  },
  {
    field: 'expectHour',
    label: t('signOff.overtime.expectHourTitle'),
  },
  {
    field: 'expectMinute',
    label: t('signOff.overtime.expectMinuteTitle'),
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('signOff.overtime.levelTitle'),
    dataIndex: 'level',
    width: 100,
  },
  {
    title: t('signOff.overtime.signOffUserTitle'),
    dataIndex: 'signOffUser',
    width: 100,
    customRender: ({ record }) => {
      const notify = record.notify;
      const user = record.signOffUser;
      return notify === 2 ? (
        <div>
          {user}
          <span>
            {'('}
            <b>{t('signOff.overtime.onlyNotify')}</b>
            {')'}
          </span>
        </div>
      ) : (
        <div> {user} </div>
      );
    },
  },
  {
    title: t('signOff.overtime.signTypeTitle'),
    dataIndex: 'signType',
    width: 100,
    customRender: ({ record }) => {
      const signType = record.signType;
      let text = '';
      switch (signType) {
        case 1:
          text = t('signOff.overtime.manager');
          break;
        case 2:
          text = t('signOff.overtime.user');
          break;
        case 3:
          text = t('signOff.overtime.own');
          break;
      }
      return text;
    },
  },
  {
    title: t('signOff.overtime.statusTitle'),
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      const status = record.status;
      let text = '';
      switch (status) {
        case 1:
          text = t('signOff.overtime.approve');
          break;
        case 2:
          text = t('signOff.overtime.reject');
          break;
        case 3:
          text = t('signOff.overtime.notifySucc');
          break;
        case 4:
          text = t('signOff.overtime.signing');
          break;
        case 5:
          text = t('signOff.overtime.notifyErr');
          break;
      }
      return text;
    },
  },
  {
    title: t('signOff.overtime.commentTitle'),
    dataIndex: 'comment',
    width: 100,
  },
  {
    title: t('signOff.overtime.signDateTitle'),
    dataIndex: 'signDate',
    width: 100,
  },
];

export const rateColumns: BasicColumn[] = [
  {
    title: t('signOff.overtime.intervalTitle'),
    customRender: ({ record }) => {
      return `${record.start} - ${record.end}`;
    },
  },
  {
    title: t('signOff.overtime.multiplyTitle'),
    dataIndex: 'multiply',
  },
];
