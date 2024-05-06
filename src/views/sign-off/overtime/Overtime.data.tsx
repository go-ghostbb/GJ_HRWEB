import { DescItem } from '@/components/Description';
import { BasicColumn } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';
import { SignNotify, SignStatus, SignType } from '@/api/daily/model/leaveModel';
import dayjs from 'dayjs';
import { EmployeeModel } from '@/api/database/employee/model/employeeModel';
import { DepartmentModel } from '@/api/database/department/model/departmentModel';

const { t } = useI18n();

export const infoDescSchema: DescItem[] = [
  {
    field: 'order',
    label: t('signOff.overtime.orderTitle'),
  },
  {
    field: 'createdAt',
    label: t('signOff.leave.createdAtTitle'),
    render: (val: Date, _record) => {
      const date = dayjs(val);
      return date.format('YYYY-MM-DD');
    },
  },
  {
    field: 'employee',
    label: t('signOff.leave.userTitle'),
    render: (val: EmployeeModel, _record) => {
      return val.realName;
    },
  },
  {
    field: 'department',
    label: t('signOff.leave.departmentTitle'),
    render: (val: DepartmentModel, _record) => {
      return val.name;
    },
  },
  {
    field: 'remark',
    label: t('signOff.overtime.remarkTitle'),
  },
];

export const detailDescSchema: DescItem[] = [
  {
    field: 'vacation',
    label: t('signOff.overtime.typeTitle'),
    render: (val, _record) => {
      return <div>{val.name}</div>;
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
    field: 'estimatedHours',
    label: '預計加班時數',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('signOff.leave.levelTitle'),
    width: 100,
    customRender: ({ record }) => {
      return record.level;
    },
  },
  {
    title: t('signOff.leave.signOffUserTitle'),
    width: 100,
    customRender: ({ record }) => {
      const notify = record.notify;
      const user = record.signOffEmployee.realName;
      return notify === SignNotify.NotifyOnly ? (
        <div>
          {user}
          <span>
            {'('}
            <b>{t('signOff.leave.onlyNotify')}</b>
            {')'}
          </span>
        </div>
      ) : (
        <div> {user} </div>
      );
    },
  },
  {
    title: t('signOff.leave.signTypeTitle'),
    width: 100,
    customRender: ({ record }) => {
      const signType = record.signType;
      let text = '';
      switch (signType) {
        case SignType.DepartmentManager:
          text = t('signOff.leave.manager');
          break;
        case SignType.SpecificEmployee:
          text = t('signOff.leave.user');
          break;
        case SignType.Agent:
          text = t('signOff.leave.proxy');
          break;
      }
      return text;
    },
  },
  {
    title: t('signOff.leave.statusTitle'),
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }) => {
      const status = record.status;
      let text = '';
      switch (status) {
        case SignStatus.SignStatusApprove:
          text = t('signOff.leave.approve');
          break;
        case SignStatus.SignStatusReject:
          text = t('signOff.leave.reject');
          break;
        case SignStatus.SignStatusOnlyNotifySuc:
          text = t('signOff.leave.notifySucc');
          break;
        case SignStatus.SignStatusSigning:
          text = t('signOff.leave.signing');
          break;
        case SignStatus.SignStatusOnlyNotifyFail:
          text = t('signOff.leave.notifyErr');
          break;
      }
      return text;
    },
  },
  {
    title: t('signOff.leave.commentTitle'),
    width: 100,
    customRender: ({ record }) => {
      return record.comment;
    },
  },
  {
    title: t('signOff.leave.signDateTitle'),
    width: 100,
    customRender: ({ record }) => {
      const date = dayjs(record.signDate);
      if (date.isSame('0001-01-01', 'year')) {
        return '';
      } else {
        return date.format('YYYY-MM-DD HH:mm:ss');
      }
    },
  },
];

export const rateColumns: BasicColumn[] = [
  {
    title: '加班開始時數',
    dataIndex: 'hours',
  },
  {
    title: '自動填滿',
    customRender: ({ record }) => {
      if (record.isFill) {
        return record.fill;
      }

      return '-';
    },
  },
  {
    title: t('signOff.overtime.multiplyTitle'),
    dataIndex: 'multiply',
  },
];
