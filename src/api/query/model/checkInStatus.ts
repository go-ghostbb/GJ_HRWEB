import { BasicDatabaseModel } from '@/api/model/baseModel';
import { EmployeeModel } from '@/api/database/employee/model/employeeModel';

export enum WorkAttendStatus {
  WorkNormal = 'normal',
  WorkNotSwiped = 'not swiped',
  WorkLate = 'late',
  WorkOffDay = 'off day',
}

export enum CheckInProcStatus {
  ProcNormal = 'normal',
  NotProcessed = 'not processed',
  Processed = 'processed',
}

export enum OffWorkAttendStatus {
  OffWorkNormal = 'normal',
  OffWorkNotSwiped = 'not swiped',
  OffWorkEarly = 'early',
  OffWorkOffDay = 'off day',
}

export interface WorkShiftModel extends BasicDatabaseModel {
  code?: string;
  name?: string;
  status?: boolean;
  remark?: string;
  workStart?: string;
  workEnd?: string;
  restStart?: string;
  restEnd?: string;
  totalHours?: number;
  color?: string;
}

export interface CheckInStatusModel extends BasicDatabaseModel {
  employeeId?: number;
  employee?: EmployeeModel;
  workShiftId?: number;
  workShift?: WorkShiftModel;
  workCheckInDate?: Date;
  workAttendTime?: Date;
  workAttendStatus?: WorkAttendStatus;
  workAttendProcStatus?: CheckInProcStatus;
  offWorkCheckInDate?: Date;
  offWorkAttendTime?: Date;
  offWorkAttendStatus?: OffWorkAttendStatus;
  offWorkAttendProcStatus?: CheckInProcStatus;
  absenceHours?: number;
  leaveHours?: number;
  signLeaveHours?: number;
  overtimeHours?: number;
  signOvertimeHours?: number;
}
