import { ErrorMessageMode } from '#/axios';
import { defHttp } from '@/utils/http/axios';
import { EmployeeModel, GetEmployeeByKeywordParams } from './model/employeeModel';
import { BasicFetchResult } from '@/api/model/baseModel';

/**
 * @description 根據params獲取對應員工
 * @param params 查詢條件
 * @param mode error mode
 * @returns Promise
 */
export function getEmployeeByKeyword(
  params?: GetEmployeeByKeywordParams,
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<BasicFetchResult<EmployeeModel>>(
    { url: '/v1/employee', params },
    {
      errorMessageMode: mode,
    },
  );
}
