import { BasicDatabaseModel } from '@/api/model/baseModel';
import { EmployeeModel } from '../../employee/model/employeeModel';

/**
 * @description Department interface result
 */
export interface DepartmentModel extends BasicDatabaseModel {
  parentId?: number;
  code?: string;
  name?: string;
  remark?: string;
  managerId?: number;
  manager?: EmployeeModel;
  children?: DepartmentModel[];
}
