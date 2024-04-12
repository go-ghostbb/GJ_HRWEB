import { defHttp } from '@/utils/http/axios';
import { BasicFetchResult } from '../model/baseModel';
import {
  GetLeaveFormByEmployeeParams,
  LeaveBasicForm,
  LeaveRequestFormModel,
} from './model/leaveModel';
import { ErrorMessageMode } from '#/axios';

/**
 * @description 獲取請假單列表
 * @param params date range
 * @param mode error mode
 * @returns Promise
 */
export const getLeaveFormByEmployee = (
  params: GetLeaveFormByEmployeeParams,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get<BasicFetchResult<LeaveRequestFormModel>>(
    { url: '/v1/daily/leave', params },
    { errorMessageMode: mode },
  );
};

/**
 * @description 儲存請假單
 * @param params
 * @param mode error mode
 * @returns Promise
 */
export const saveLeaveForm = (params: LeaveBasicForm, mode: ErrorMessageMode = 'message') => {
  return defHttp.post({ url: '/v1/daily/leave', params }, { errorMessageMode: mode });
};

/**
 * @description 刪除請假單
 * @param id form id
 * @param mode error mode
 * @returns Promise
 */
export const deleteLeaveForm = (id: number, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete({ url: `/v1/daily/leave/${id}` }, { errorMessageMode: mode });
};
