export enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export interface ScheduleType extends Record<DayOfWeek, WorkingHoursRange | null> {}

export interface WorkingHoursRange {
  startTime: string // "HH:mm" string in the schedule creator's timezone
  finishTime: string // "HH:mm" string in the schedule creator's timezone
}
