import { defHttp } from '@/utils/http/axios';
import { LoginParams, LoginResultModel, GetEmployeeInfoModel } from './model/employeeModel';

import { ErrorMessageMode } from '#/axios';

enum Api {
  Login = '/v1/login/web',
  Logout = '/v1/logout/web',
  GetEmployeeInfo = '/v1/me/info',
  GetPermCode = '/v1/me/perm',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getEmployeeInfo
 */
export function getEmployeeInfo() {
  return defHttp.get<GetEmployeeInfoModel>(
    { url: Api.GetEmployeeInfo },
    { errorMessageMode: 'none' },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.delete({ url: Api.Logout });
}
