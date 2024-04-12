import { DepartmentModel } from '@/api/database/department/model/departmentModel';
import { EmployeeModel } from '@/api/database/employee/model/employeeModel';
import { LeaveModel } from '@/api/database/leave/model/leaveModel';
import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';

export enum SignStatus {
  // 送簽中
  SignStatusSending = 0,
  // 核准
  SignStatusApprove = 1,
  // 駁回
  SignStatusReject = 2,
  // 簽核中
  SignStatusSigning = 3,
  // 僅通知，通知成功
  SignStatusOnlyNotifySuc = 4,
  // 僅通知，通知失敗
  SignStatusOnlyNotifyFail = 5,
}

export enum SignType {
  DepartmentManager = 'department manager',
  SpecificEmployee = 'specific employee',
  Agent = 'agent',
}

export enum SignNotify {
  SignOffPlusNotify = 'sign-off plus notification',
  NotifyOnly = 'notification only',
}

export interface LeaveBasicForm {
  ID?: number;
  proxyEmployeeId?: number;
  leaveId?: number;
  date?: string[];
  time?: string[];
  attach?: string[];
  remark?: string;
}

export interface LeaveRequestFormModel extends BasicDatabaseModel {
  order?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  remark?: string;
  signStatus?: SignStatus;
  leaveMinuteCount?: number;
  leaveHourCount?: number;
  leaveDayCount?: number;
  isDefer?: boolean;
  attach?: string;
  leaveId?: number;
  leave?: LeaveModel;
  employeeId?: number;
  employee?: EmployeeModel;
  departmentId?: number;
  department?: DepartmentModel;
  proxyEmployeeId?: number;
  proxyEmployee?: EmployeeModel;
  proxyDepartmentId?: number;
  proxyDepartment?: DepartmentModel;
  signOffFlow?: LeaveSignOffFlow[];
}

export interface LeaveSignOffFlow extends BasicDatabaseModel {
  leaveRequestFormId?: number;
  leaveRequestForm?: LeaveRequestFormModel;
  signOffEmployeeId?: number;
  signOffEmployee?: EmployeeModel;
  level?: number;
  signType?: SignType;
  notify?: SignNotify;
  remark?: string;
  comment?: string;
  status?: SignStatus;
  signDate?: Date;
  uuid?: string;
  locale?: string;
}

export interface GetLeaveFormByEmployeeParams extends BasicPageParams {
  startDate: string;
  endDate: string;
}
