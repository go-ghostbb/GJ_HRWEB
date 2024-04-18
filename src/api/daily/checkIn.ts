import {
  CheckInBasicForm,
  CheckInRequestFormModel,
  GetCheckInFormByEmployeeParams,
} from '@/api/daily/model/checkInModel';
import { ErrorMessageMode } from '#/axios';
import { BasicFetchResult } from '@/api/model/baseModel';
import { defHttp } from '@/utils/http/axios';

/**
 * @description 獲取補打卡單列表
 * @param params date range
 * @param mode error mode
 * @returns Promise
 */
export const getCheckInFormByEmployee = (
  params: GetCheckInFormByEmployeeParams,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get<BasicFetchResult<CheckInRequestFormModel>>(
    { url: '/v1/daily/checkIn', params },
    { errorMessageMode: mode },
  );
};

/**
 * @description 儲存補打卡單
 * @param params
 * @param mode error mode
 * @returns Promise
 */
export const saveCheckInForm = (params: CheckInBasicForm, mode: ErrorMessageMode = 'message') => {
  return defHttp.post({ url: '/v1/daily/checkIn', params }, { errorMessageMode: mode });
};

/**
 * @description 刪除補打卡單
 * @param id form id
 * @param mode error mode
 * @returns Promise
 */
export const deleteCheckInForm = (id: number, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete({ url: `/v1/daily/checkIn/${id}` }, { errorMessageMode: mode });
};
