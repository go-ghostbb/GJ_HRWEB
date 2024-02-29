/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  account: string;
  password: string;
}

export interface RoleInfo {
  Name: string;
  Code: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  token: string;
}

/**
 * @description: Get employee information return value
 */
export interface GetEmployeeInfoModel {
  roles: RoleInfo[];
  // 員工id
  employeeId: string | number;
  // 部門id
  departmentId: string | number;
  // 帳號
  account: string;
  // 真实名字
  realName: string;
  // 頭像
  avatar: string;
  // 介紹
  desc?: string;
}
