import { BasicDatabaseModel } from '@/api/model/baseModel';

export interface RoleModel extends BasicDatabaseModel {
  code?: string;
  name?: string;
  status?: boolean;
  remark?: string;
}
