import type { AppRouteRecordRaw } from '@/router/types';
import { t } from '@/hooks/web/useI18n';

export const signOffRoutes: AppRouteRecordRaw[] = [
  {
    path: '/sign-off/leave',
    name: 'LeaveSignOff',
    component: () => import('@/views/sign-off/leave/index.vue'),
    meta: {
      title: t('signOff.leave.title'),
    },
  },
  {
    path: '/sign-off/overtime',
    name: 'OvertimeSignOff',
    component: () => import('@/views/sign-off/overtime/index.vue'),
    meta: {
      title: t('signOff.overtime.title'),
    },
  },
  {
    path: '/sign-off/checkIn',
    name: 'CheckInSignOff',
    component: () => import('@/views/sign-off/check-in/index.vue'),
    meta: {
      title: t('signOff.checkIn.title'),
    },
  },
];
