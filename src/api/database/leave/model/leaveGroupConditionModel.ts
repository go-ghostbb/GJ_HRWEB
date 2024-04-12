import { BasicDatabaseModel } from '@/api/model/baseModel';
import { LeaveGroupModel } from './leaveGroupModel';

export enum LeaveGroupCondition {
  ConditionMonth = 'month',
  ConditionYear = 'year',
}

export interface LeaveGroupConditionModel extends BasicDatabaseModel {
  leaveGroupId?: number;
  leaveGroup?: LeaveGroupModel;
  conditionType?: LeaveGroupCondition;
  conditionNum?: number;
  result?: number;
  level?: number;
}
