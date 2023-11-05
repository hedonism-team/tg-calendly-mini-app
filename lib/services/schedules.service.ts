import { Schedule } from '@prisma/client'
import { DayOfWeek, ScheduleModel } from '@/lib/models/Schedule.model'
import prisma from '@/lib/prisma'
import { getWeekdayNames } from '@/lib/utils/weekdays'

export async function createNewSchedule(schedule: Schedule) {
  return prisma.schedule.create({
    data: schedule,
  })
}
// TODO refactor
export function mapDbScheduleToModel({
  mondayStartTime,
  mondayFinishTime,
  tuesdayStartTime,
  tuesdayFinishTime,
  wednesdayStartTime,
  wednesdayFinishTime,
  thursdayStartTime,
  thursdayFinishTime,
  fridayStartTime,
  fridayFinishTime,
  saturdayStartTime,
  saturdayFinishTime,
  sundayStartTime,
  sundayFinishTime,
}: Schedule) {
  const dayWorkingHours = [
    {
      dayOfWeek: DayOfWeek.Monday,
      start: mondayStartTime,
      finish: mondayFinishTime,
    },
    {
      dayOfWeek: DayOfWeek.Tuesday,
      start: tuesdayStartTime,
      finish: tuesdayFinishTime,
    },
    {
      dayOfWeek: DayOfWeek.Wednesday,
      start: wednesdayStartTime,
      finish: wednesdayFinishTime,
    },
    {
      dayOfWeek: DayOfWeek.Thursday,
      start: thursdayStartTime,
      finish: thursdayFinishTime,
    },
    {
      dayOfWeek: DayOfWeek.Friday,
      start: fridayStartTime,
      finish: fridayFinishTime,
    },
    {
      dayOfWeek: DayOfWeek.Saturday,
      start: saturdayStartTime,
      finish: saturdayFinishTime,
    },
    {
      dayOfWeek: DayOfWeek.Sunday,
      start: sundayStartTime,
      finish: sundayFinishTime,
    },
  ]
  const schedule: ScheduleModel = {
    [DayOfWeek.Monday]: null,
    [DayOfWeek.Tuesday]: null,
    [DayOfWeek.Wednesday]: null,
    [DayOfWeek.Thursday]: null,
    [DayOfWeek.Friday]: null,
    [DayOfWeek.Saturday]: null,
    [DayOfWeek.Sunday]: null,
  }
  for (const { dayOfWeek, start, finish } of dayWorkingHours) {
    if (isNotNull(start) && isNotNull(finish)) {
      schedule[dayOfWeek] = {
        startTime: start,
        finishTime: finish,
      }
    }
  }
  return schedule
}

function isNotNull(value: string | null): value is string {
  return typeof value === 'string'
}

export function mapScheduleModelToDbInstance(
  schedule: ScheduleModel
): Schedule {
  const weekdayNames = getWeekdayNames({ firstLetterUpperCased: false })
  return weekdayNames.reduce((previousValue, weekdayName, weekdayIndex) => {
    const dayOfWeek: DayOfWeek = weekdayIndex
    const startTimeField = `${weekdayName}StartTime` as keyof Schedule
    const finishTimeField = `${weekdayName}FinishTime` as keyof Schedule
    if (!schedule[dayOfWeek]) {
      // @ts-ignore
      previousValue[startTimeField] = null
      // @ts-ignore
      previousValue[finishTimeField] = null
    } else {
      const { startTime, finishTime } = schedule[weekdayIndex as DayOfWeek]!
      // @ts-ignore
      previousValue[startTimeField] = startTime
      // @ts-ignore
      previousValue[finishTimeField] = finishTime
    }
    return previousValue
  }, {} as Schedule)
}
