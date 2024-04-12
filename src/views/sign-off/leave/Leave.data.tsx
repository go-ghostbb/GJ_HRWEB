import { SignNotify, SignStatus, SignType } from '@/api/daily/model/leaveModel';
import { DepartmentModel } from '@/api/database/department/model/departmentModel';
import { EmployeeModel } from '@/api/database/employee/model/employeeModel';
import { LeaveModel } from '@/api/database/leave/model/leaveModel';
import { DescItem } from '@/components/Description';
import { BasicColumn } from '@/components/Table';
import { useGlobSetting } from '@/hooks/setting';
import { useI18n } from '@/hooks/web/useI18n';
import dayjs from 'dayjs';

const { apiUrl = '' } = useGlobSetting();
const { t } = useI18n();

export const infoDescSchema: DescItem[] = [
  {
    field: 'order',
    label: t('signOff.leave.orderTitle'),
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
    field: 'proxyEmployee',
    label: t('signOff.leave.proxyUserTitle'),
    render: (val: EmployeeModel, _record) => {
      return val.realName;
    },
  },
  {
    field: 'proxyDepartment',
    label: t('signOff.leave.proxyDepartmentTitle'),
    render: (val: DepartmentModel, _record) => {
      return val.name;
    },
  },
  {
    field: 'remark',
    label: t('signOff.leave.remarkTitle'),
  },
  {
    field: 'attach',
    label: t('signOff.leave.attachTitle'),
    render: (val: string, _record) => {
      if (!val) {
        return '';
      }
      const files = val.split(',');
      return (
        <div>
          {files.map((item: string) => {
            const name = item.split('/').pop() || '';
            const url = apiUrl + '/' + item;

            return (
              <div>
                <a href={url} target="_blank">
                  {name}
                </a>
                <br />
              </div>
            );
          })}
        </div>
      );
    },
  },
];

export const detailDescSchema: DescItem[] = [
  {
    field: 'leave',
    label: t('signOff.leave.leaveCoreTitle'),
    render: (val: LeaveModel, _record) => {
      return val.name;
    },
  },
  {
    field: 'startDate',
    label: t('signOff.leave.startDateTitle'),
  },
  {
    field: 'endDate',
    label: t('signOff.leave.endDateTitle'),
  },
  {
    field: 'startTime',
    label: t('signOff.leave.startTimeTitle'),
  },
  {
    field: 'endTime',
    label: t('signOff.leave.endTimeTitle'),
  },
  {
    field: 'leaveMinuteCount',
    label: t('signOff.leave.leaveMinuteCountTitle'),
  },
  {
    field: 'leaveHourCount',
    label: t('signOff.leave.leaveHourCountTitle'),
  },
  {
    field: 'leaveDayCount',
    label: t('signOff.leave.leaveDayCountTitle'),
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
