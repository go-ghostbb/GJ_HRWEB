import type { EmployeeInfo } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { RoleEnum } from '@/enums/roleEnum';
import { PageEnum } from '@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, EMPLOYEE_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { GetEmployeeInfoModel, LoginParams } from '@/api/sys/model/employeeModel';
import { doLogout, getEmployeeInfo, loginApi } from '@/api/sys/employee';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { isArray } from '@/utils/is';
import { h } from 'vue';

interface EmployeeState {
  employeeInfo: Nullable<EmployeeInfo>;
  token?: string;
  roleList: RoleEnum[];
  lastUpdateTime: number;
}

export const useEmployeeStore = defineStore({
  id: 'app-employee',
  state: (): EmployeeState => ({
    // employee info
    employeeInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getEmployeeInfo(state): EmployeeInfo {
      return state.employeeInfo || getAuthCache<EmployeeInfo>(EMPLOYEE_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setEmployeeInfo(info: EmployeeInfo | null) {
      this.employeeInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(EMPLOYEE_INFO_KEY, info);
    },
    resetState() {
      this.employeeInfo = null;
      this.token = '';
      this.roleList = [];
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetEmployeeInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { token } = data;

        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetEmployeeInfoModel | null> {
      if (!this.getToken) return null;
      // get employee info
      const employeeInfo = await this.getEmployeeInfoAction();

      const permissionStore = usePermissionStore();

      // 动态路由加载（首次）
      if (!permissionStore.isDynamicAddedRoute) {
        const routes = await permissionStore.buildRoutesAction();
        [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw);
        });
        // 记录动态路由加载完成
        permissionStore.setDynamicAddedRoute(true);
      }

      goHome && (await router.replace(employeeInfo?.homePath || PageEnum.BASE_HOME));

      return employeeInfo;
    },
    async getEmployeeInfoAction(): Promise<EmployeeInfo | null> {
      if (!this.getToken) return null;
      const employeeInfo = await getEmployeeInfo();
      const { roles = [] } = employeeInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.Code) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        employeeInfo.roles = [];
        this.setRoleList([]);
      }
      this.setEmployeeInfo(employeeInfo);
      return employeeInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setEmployeeInfo(null);
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          // 主动登出，不带redirect地址
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useEmployeeStoreWithOut() {
  return useEmployeeStore(store);
}
