import { defHttp } from '@/utils/http/axios';
import { BasicFetchResult } from '../model/baseModel';
import {
  GetOvertimeFormByEmployeeParams,
  OvertimeBasicForm,
  OvertimeRequestFormModel,
} from './model/overtimeModel';
import { ErrorMessageMode } from '#/axios';

/**
 * @description 獲取加班單列表
 * @param params date range
 * @param mode error mode
 * @returns Promise
 */
export const getOvertimeFormByEmployee = (
  params: GetOvertimeFormByEmployeeParams,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get<BasicFetchResult<OvertimeRequestFormModel>>(
    { url: '/v1/daily/overtime', params },
    { errorMessageMode: mode },
  );
};

/**
 * @description 儲存加班單
 * @param params
 * @param mode error mode
 * @returns Promise
 */
export const saveOvertimeForm = (params: OvertimeBasicForm, mode: ErrorMessageMode = 'message') => {
  return defHttp.post({ url: '/v1/daily/overtime', params }, { errorMessageMode: mode });
};

/**
 * @description 刪除加班單
 * @param id form id
 * @param mode error mode
 * @returns Promise
 */
export const deleteOvertimeForm = (id: number, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete({ url: `/v1/daily/overtime/${id}` }, { errorMessageMode: mode });
};
