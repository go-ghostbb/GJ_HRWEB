import { defHttp } from '@/utils/http/axios';
import { OvertimeRequestFormModel } from '@/api/daily/model/overtimeModel';
import { ErrorMessageMode } from '#/axios';

/**
 * @description 根據uuid獲加班單內容
 * @param uuid
 * @param mode error mode
 * @returns Promise
 */
export function getOvertimeFormByUUID(uuid: string, mode: ErrorMessageMode = 'message') {
  return defHttp.get<OvertimeRequestFormModel>(
    { url: '/v1/sign-off/overtime', params: { uuid } },
    { errorMessageMode: mode },
  );
}

/**
 * @description加班核准
 * @param uuid
 * @param comment
 * @param mode error mode
 * @returns Promise
 */
export function overtimeApprove(uuid: string, comment: string, mode: ErrorMessageMode = 'message') {
  return defHttp.put(
    { url: `/v1/sign-off/overtime/approve/${uuid}`, params: { comment } },
    { errorMessageMode: mode },
  );
}

/**
 * @description加班駁回
 * @param uuid
 * @param comment
 * @param mode error mode
 * @returns Promise
 */
export function overtimeReject(uuid: string, comment: string, mode: ErrorMessageMode = 'message') {
  return defHttp.put(
    { url: `/v1/sign-off/overtime/reject/${uuid}`, params: { comment } },
    { errorMessageMode: mode },
  );
}
