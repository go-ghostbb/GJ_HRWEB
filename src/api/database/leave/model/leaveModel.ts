import { BasicDatabaseModel, BasicPageParams } from '@/api/model/baseModel';
import { LeaveGroupModel } from './leaveGroupModel';

export enum LeavePay {
  None = 'none',
  Half = 'half',
  All = 'all',
}

export enum LeaveCycle {
  Default = 'year',
  Annual = 'annual',
  Calendar = 'calendar',
}

/**
 * @description Leave interface result
 */
export interface LeaveModel extends BasicDatabaseModel {
  code?: string;
  name?: string;
  status?: boolean;
  default?: number;
  minimum?: number;
  pay?: LeavePay;
  cycle?: LeaveCycle;
  remark?: string;

  deferrable?: boolean;
  deferrableDays?: number;
  customizableDuration?: boolean;
  duration?: number;

  leaveGroup?: LeaveGroupModel[];
}

/**
 * @description GetLeaveByKeyword interface parameters
 */
export interface GetLeaveByKeywordParams extends BasicPageParams {
  keyword?: string;
  status?: string;
}
