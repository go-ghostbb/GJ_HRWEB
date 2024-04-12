import { DepartmentModel } from '@/api/department/model/departmentModel';
import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';
import { RoleModel } from '@/api/database/role/model/roleModel';

export enum EmploymentStatus {
  Active = 'active',
  UnpaidLeave = 'unpaid leave',
  Resigned = 'resigned',
}

export enum SalaryCycle {
  Month = 'month',
  Hour = 'hour',
}

/**
 * @description Employee interface result
 */
export interface EmployeeModel extends BasicDatabaseModel {
  code?: string;
  hireDate?: Date;
  terminationDate?: Date;
  employmentStatus?: string;
  backend?: boolean;
  realName?: string;
  nationalId?: string;
  birth?: Date;
  email?: string;
  mobile?: string;
  avatar?: string;
  cardNumber?: string;
  loginInformation?: LoginInformationModel;
  roles?: RoleModel[];
  departmentId?: number;
  department?: DepartmentModel;
  salary?: number;
  salaryCycle?: SalaryCycle;
}

/**
 * @description 登入資訊
 */
export interface LoginInformationModel extends BasicDatabaseModel {
  employeeId: number;
  status: boolean;
  account: string;
  password: string;
}

/**
 * @description GetEmployeeByKeyword interface parameters
 */
export interface GetEmployeeByKeywordParams extends BasicPageParams {
  keyword?: string;
  employmentStatus?: string;
  departmentId?: number;
}
