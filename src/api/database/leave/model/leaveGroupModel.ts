import { BasicDatabaseModel } from '@/api/model/baseModel';
import { LeaveModel } from './leaveModel';
import { LeaveGroupCondition } from './leaveGroupConditionModel';
import { EmployeeModel } from '../../employee/model/employeeModel';

export interface LeaveGroupModel extends BasicDatabaseModel {
  leaveId?: number;
  leave?: LeaveModel;
  name?: string;

  employee?: EmployeeModel[];
  leaveGroupCondition?: LeaveGroupCondition[];
}
