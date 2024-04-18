import type { Router, RouteRecordRaw } from 'vue-router';

import { usePermissionStoreWithOut } from '@/store/modules/permission';

import { PageEnum } from '@/enums/pageEnum';
import { useEmployeeStoreWithOut } from '@/store/modules/employee';

import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';

import { RootRoute } from '@/router/routes';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const LEAVE_SIGN_OFF_PAGE = PageEnum.LEAVE_SIGN_OFF_PAGE;
const OVERTIME_SIGN_OFF_PAGE = PageEnum.OVERTIME_SIGN_OFF_PAGE;
const CHECKIN_SIGN_OFF_PAGE = PageEnum.CHECKIN_SIGN_OFF_PAGE;

const ROOT_PATH = RootRoute.path;

const whitePathList: PageEnum[] = [
  LOGIN_PATH,
  LEAVE_SIGN_OFF_PAGE,
  OVERTIME_SIGN_OFF_PAGE,
  CHECKIN_SIGN_OFF_PAGE,
];

export function createPermissionGuard(router: Router) {
  const userStore = useEmployeeStoreWithOut();
  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    if (
      from.path === ROOT_PATH &&
      to.path === PageEnum.BASE_HOME &&
      userStore.getEmployeeInfo.homePath &&
      userStore.getEmployeeInfo.homePath !== PageEnum.BASE_HOME
    ) {
      next(userStore.getEmployeeInfo.homePath);
      return;
    }

    const token = userStore.getToken;

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum)) {
      if (to.path === LOGIN_PATH && token) {
        try {
          await userStore.afterLoginAction();
        } catch {
          //
        }
      }
      next();
      return;
    }
    // token or user does not exist
    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true
      if (to.meta.ignoreAuth) {
        next();
        return;
      }

      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    // get userinfo while last fetch time is empty
    if (userStore.getLastUpdateTime === 0) {
      try {
        await userStore.getEmployeeInfoAction();
      } catch (err) {
        next();
        return;
      }
    }

    // 动态路由加载（首次）
    if (!permissionStore.getIsDynamicAddedRoute) {
      const routes = await permissionStore.buildRoutesAction();
      [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw);
      });
      // 记录动态路由加载完成
      permissionStore.setDynamicAddedRoute(true);

      // 现在的to动态路由加载之前的，可能为PAGE_NOT_FOUND_ROUTE（例如，登陆后，刷新的时候）
      // 此处应当重定向到fullPath，否则会加载404页面内容
      next({ path: to.fullPath, replace: true, query: to.query });
      return;
    }

    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      // 遇到不存在页面，后续逻辑不再处理redirect（阻止下面else逻辑）
      from.query.redirect = '';

      if (
        from.path === LOGIN_PATH &&
        to.fullPath !== (userStore.getEmployeeInfo.homePath || PageEnum.BASE_HOME)
      ) {
        // 登陆重定向不存在路由，转去“首页”
        next({ path: userStore.getEmployeeInfo.homePath || PageEnum.BASE_HOME, replace: true });
      } else {
        // 正常前往“404”页面
        next();
      }
    } else if (from.query.redirect) {
      // 存在redirect
      const redirect = decodeURIComponent((from.query.redirect as string) || '');

      // 只处理一次 from.query.redirect
      // 也避免某场景（指向路由定义了 redirect）下的死循环
      from.query.redirect = '';

      if (redirect === to.fullPath) {
        // 已经被redirect
        next();
      } else {
        // 指向redirect
        next({ path: redirect, replace: true });
      }
      next();
    } else {
      // 正常访问
      next();
    }
  });
}
