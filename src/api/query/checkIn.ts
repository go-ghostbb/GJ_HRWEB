import { CheckInStatusModel } from '@/api/query/model/checkInStatus';
import { ErrorMessageMode } from '#/axios';
import { defHttp } from '@/utils/http/axios';

/**
 * @description 根據區間和員工ID獲取打卡狀態
 * @param params
 * @param mode error mode
 * @returns Promise
 */
export function getByDateRangeCheckInStatus(
  params: { dateRange: string[]; abnormal: boolean },
  mode: ErrorMessageMode = 'message',
) {
  return defHttp.get<CheckInStatusModel[]>(
    {
      url: `/v1/query/checkIn/status`,
      params: {
        dateRangeStart: params.dateRange[0],
        dateRangeEnd: params.dateRange[1],
        abnormal: params.abnormal,
      },
    },
    { errorMessageMode: mode },
  );
}
