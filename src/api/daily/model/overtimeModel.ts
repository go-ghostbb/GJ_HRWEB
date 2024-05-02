import { DepartmentModel } from '@/api/database/department/model/departmentModel';
import { EmployeeModel } from '@/api/database/employee/model/employeeModel';
import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';
import { SignStatus, SignType } from '@/api/daily/model/leaveModel';

export interface OvertimeRequestFormModel extends BasicDatabaseModel {
  order: string;
  signStatus: SignStatus;
  attach: string;
  remark: string;
  employeeId: number;
  employee: EmployeeModel;
  departmentId: number;
  department?: DepartmentModel;
  signOffFlow?: OvertimeSignOffFlow[];
}

export interface OvertimeSignOffFlow extends BasicDatabaseModel {
  overtimeRequestFormId?: number;
  overtimeRequestForm?: OvertimeRequestFormModel;
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

export interface GetOvertimeFormByEmployeeParams extends BasicPageParams {
  startDate: string;
  endDate: string;
}

export interface OvertimeBasicForm {
  id?: number;
  date?: string;
  startTime?: string;
  endTime?: string;
  remark?: string;
}
