import prisma from '@/lib/prisma'
import type { Link, Schedule } from '@prisma/client'
import { LinkModel } from '@/lib/models/Link.model'
import { DayOfWeek, ScheduleType } from '@/lib/models/Schedule.model'

export async function getLinkById(
  linkId: string,
  { includeSchedule }: { includeSchedule: boolean } = { includeSchedule: false }
) {
  const dbInstance = await prisma.link.findUnique({
    where: {
      id: linkId,
    },
    include: {
      Schedule: includeSchedule,
    },
  })
  if (!dbInstance) {
    return null
  }
  return mapDbInstanceToModel(dbInstance, dbInstance.Schedule)
}

// private

function mapDbInstanceToModel(
  { id, userId, timezone, durationHours, durationMinutes }: Link,
  dbSchedule: Schedule | null
) {
  const model: LinkModel = {
    id,
    userId,
    timezone,
    duration: {
      hours: durationHours,
      minutes: durationMinutes,
    },
  }
  if (dbSchedule) {
    model.schedule = mapDbScheduleToModel(dbSchedule)
  }
  return model
}

function mapDbScheduleToModel({
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
  const schedule: ScheduleType = {
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
