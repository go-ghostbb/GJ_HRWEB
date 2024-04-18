import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { CheckInRequestFormModel } from '@/api/daily/model/checkInModel';

/**
 * @description 根據uuid獲取補打卡單內容
 * @param uuid
 * @param mode error mode
 * @returns Promise
 */
export function getCheckInFormByUUID(uuid: string, mode: ErrorMessageMode = 'message') {
  return defHttp.get<CheckInRequestFormModel>(
    { url: '/v1/sign-off/checkIn', params: { uuid } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 補打卡核准
 * @param uuid
 * @param mode error mode
 * @returns Promise
 */
export function checkInApprove(uuid: string, comment: string, mode: ErrorMessageMode = 'message') {
  return defHttp.put(
    { url: `/v1/sign-off/checkIn/approve/${uuid}`, params: { comment } },
    { errorMessageMode: mode },
  );
}

/**
 * @description 補打卡駁回
 * @param uuid
 * @param mode error mode
 * @returns Promise
 */
export function checkInReject(uuid: string, comment: string, mode: ErrorMessageMode = 'message') {
  return defHttp.put(
    { url: `/v1/sign-off/checkIn/reject/${uuid}`, params: { comment } },
    { errorMessageMode: mode },
  );
}
