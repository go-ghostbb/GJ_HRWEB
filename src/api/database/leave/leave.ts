import { ErrorMessageMode } from '#/axios';
import { defHttp } from '@/utils/http/axios';
import { GetLeaveByKeywordParams, LeaveModel } from './model/leaveModel';
import { BasicFetchResult } from '@/api/model/baseModel';

/**
 * @description 根據keyword獲取leave
 * @param params 查詢參數
 */
export function getLeaveByKeyword(
  params?: GetLeaveByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<LeaveModel>>(
    { url: '/v1/leave', params },
    {
      errorMessageMode: mode,
    },
  );
}
