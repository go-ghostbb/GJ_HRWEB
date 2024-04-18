import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';
import { SignStatus, SignType } from '@/api/daily/model/leaveModel';
import { EmployeeModel } from '@/api/database/employee/model/employeeModel';
import { DepartmentModel } from '@/api/database/department/model/departmentModel';

export enum CheckInType {
  Work = 'work',
  OffWork = 'off work',
}

export interface CheckInRequestFormModel extends BasicDatabaseModel {
  order: string;
  signStatus: SignStatus;
  attach: string;
  remark: string;
  employeeId: number;
  employee: EmployeeModel;
  departmentId: number;
  department?: DepartmentModel;
  signOffFlow?: CheckInSignOffFlow[];
  detail?: CheckInRequestFormDetail[];
}

export interface CheckInSignOffFlow extends BasicDatabaseModel {
  checkInRequestFormId?: number;
  checkInRequestForm?: CheckInRequestFormModel;
  signOffEmployeeId?: number;
  signOffEmployee?: EmployeeModel;
  level?: number;
  signType?: SignType;
  notify?: SignStatus;
  remark?: string;
  comment?: string;
  status?: SignStatus;
  signDate?: Date;
  uuid?: string;
  locale?: string;
}

export interface CheckInRequestFormDetail extends BasicDatabaseModel {
  checkInRequestFormId?: number;
  checkInRequestForm?: CheckInRequestFormModel;
  checkInType?: CheckInType;
  date?: string;
  time?: string;
  remark?: string;
}

export interface GetCheckInFormByEmployeeParams extends BasicPageParams {
  startDate: string;
  endDate: string;
}

export interface CheckInBasicForm {
  id?: number;
  detail?: CheckInBasicFormDetail[];
  attach?: string[];
  remark?: string;
}

export interface CheckInBasicFormDetail {
  checkInType?: CheckInType;
  date?: string;
  time?: string;
  remark?: string;
}
