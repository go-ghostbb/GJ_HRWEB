import { ErrorMessageMode } from '#/axios';
import { defHttp } from '@/utils/http/axios';
import { LeaveCorrectModel } from '@/api/query/model/leaveCorrect';

/**
 * @description 根據員工ID獲取可請假列表
 * @param params
 * @param mode error mode
 * @returns Promise
 */
export function getLeaveCorrect(params: { year: string }, mode: ErrorMessageMode = 'message') {
  return defHttp.get<LeaveCorrectModel[]>(
    {
      url: `/v1/query/leave/correct`,
      params,
    },
    { errorMessageMode: mode },
  );
}
