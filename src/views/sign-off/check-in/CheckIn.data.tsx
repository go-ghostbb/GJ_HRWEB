import { SignNotify, SignStatus, SignType } from '@/api/daily/model/leaveModel';
import { DepartmentModel } from '@/api/database/department/model/departmentModel';
import { EmployeeModel } from '@/api/database/employee/model/employeeModel';
import { DescItem } from '@/components/Description';
import { BasicColumn } from '@/components/Table';
import { useGlobSetting } from '@/hooks/setting';
import { useI18n } from '@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { CheckInType } from '@/api/daily/model/checkInModel';

const { apiUrl = '' } = useGlobSetting();
const { t } = useI18n();

export const infoDescSchema: DescItem[] = [
  {
    field: 'order',
    label: '單號',
  },
  {
    field: 'createdAt',
    label: '創建時間',
    render: (val: Date, _record) => {
      const date = dayjs(val);
      return date.format('YYYY-MM-DD');
    },
  },
  {
    field: 'employee',
    label: '員工',
    render: (val: EmployeeModel, _record) => {
      return val.realName;
    },
  },
  {
    field: 'department',
    label: '部門',
    render: (val: DepartmentModel, _record) => {
      return val.name;
    },
  },
  {
    field: 'remark',
    label: '備註',
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

export const detailColumns: BasicColumn[] = [
  {
    title: '類型',
    width: 100,
    customRender: ({ record }) => {
      switch (record.checkInType) {
        case CheckInType.Work:
          return '上班';
        case CheckInType.OffWork:
          return '下班';
      }
    },
  },
  {
    title: '日期',
    width: 100,
    customRender: ({ record }) => {
      return record.date;
    },
  },
  {
    title: '時間',
    width: 100,
    customRender: ({ record }) => {
      return record.time;
    },
  },
  {
    title: '原因',
    width: 100,
    customRender: ({ record }) => {
      return record.remark;
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '關卡',
    width: 100,
    customRender: ({ record }) => {
      return record.level;
    },
  },
  {
    title: '員工',
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
    title: '類型',
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
    title: '狀態',
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
    title: '意見',
    width: 100,
    customRender: ({ record }) => {
      return record.comment;
    },
  },
  {
    title: '簽核時間',
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
