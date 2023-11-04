import prisma from '@/lib/prisma'
import type { Link, Schedule } from '@prisma/client'
import { LinkModel } from '@/lib/models/Link.model'
import {
  createNewSchedule,
  mapDbScheduleToModel,
} from '@/lib/services/schedules.service'
import { createUserIfNotExists } from '@/lib/services/users.service'

export async function createNewLink(
  { id, userId, timezone, duration }: LinkModel,
  schedule: Schedule
) {
  await createUserIfNotExists({ id: userId })
  const scheduleInstance = await createNewSchedule(schedule)
  return mapDbInstanceToModel(
    await prisma.link.create({
      data: {
        id,
        userId,
        timezone,
        durationHours: duration.hours,
        durationMinutes: duration.minutes,
        scheduleId: scheduleInstance.id,
      },
    }),
    scheduleInstance
  )
}

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

// function mapScheduleModelToDbInstance(schedule: ScheduleType) {
//   const weekdayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
// }
