import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { LeaveRequestFormModel } from '../daily/model/leaveModel';

/**
 * @description 根據uuid獲取請假單內容
 * @param uuid
 * @param mode error mode
 * @returns Promise
 */
export function getLeaveFormByUUID(uuid: string, mode: ErrorMessageMode = 'message') {
  return defHttp.get<LeaveRequestFormModel>(
    { url: '/v1/sign-off/leave', params: { uuid } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 請假核准
 * @param uuid
 * @param mode error mode
 * @returns Promise
 */
export function leaveApprove(uuid: string, comment: string, mode: ErrorMessageMode = 'message') {
  return defHttp.put(
    { url: `/v1/sign-off/leave/approve/${uuid}`, params: { comment } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 請假駁回
 * @param uuid
 * @param mode error mode
 * @returns Promise
 */
export function leaveReject(uuid: string, comment: string, mode: ErrorMessageMode = 'message') {
  return defHttp.put(
    { url: `/v1/sign-off/leave/reject/${uuid}`, params: { comment } },
    { errorMessageMode: mode },
  );
}
