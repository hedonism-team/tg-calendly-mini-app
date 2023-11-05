import prisma from '@/lib/prisma'
import type { Link } from '@prisma/client'

import { LinkModel } from '@/lib/models/Link.model'
import {
  createOrUpdateSchedule,
  mapDbScheduleToModel,
} from '@/lib/services/schedules.service'
import { createOrUpdateUser } from '@/lib/services/users.service'
import { ScheduleModel, ScheduleModelWithId } from '@/lib/models/Schedule.model'

export async function createOrUpdateLink(
  { userId, timezone, duration }: Omit<LinkModel, 'schedule' | 'id'>,
  schedule: Omit<ScheduleModel, 'id'>
) {
  const user = await createOrUpdateUser({ id: userId })
  const existingLink = await prisma.link.findUnique({ where: { id: user.tag } })
  const linkId = existingLink ? existingLink.id : user.tag
  const scheduleInstance = await createOrUpdateSchedule(schedule, {
    id: linkId,
    userId,
  })
  if (existingLink) {
    return {
      link: mapDbInstanceToModel(
        await prisma.link.update({
          where: {
            id: linkId,
          },
          data: {
            timezone,
            durationHours: duration.hours,
            durationMinutes: duration.minutes,
            scheduleId: scheduleInstance.id,
          },
        }),
        scheduleInstance
      ),
      isNew: false,
    }
  }
  return {
    link: mapDbInstanceToModel(
      await prisma.link.create({
        data: {
          id: linkId,
          userId,
          timezone,
          durationHours: duration.hours,
          durationMinutes: duration.minutes,
          scheduleId: scheduleInstance.id,
        },
      }),
      scheduleInstance
    ),
    isNew: true,
  }
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
  return mapDbInstanceToModel(
    dbInstance,
    includeSchedule ? mapDbScheduleToModel(dbInstance.Schedule) : undefined
  )
}

// private

function mapDbInstanceToModel(
  { id, userId, timezone, durationHours, durationMinutes }: Link,
  schedule: ScheduleModelWithId | undefined
): LinkModel {
  const model: LinkModel = {
    id,
    userId: Number.parseInt(userId.toString()),
    timezone,
    duration: {
      hours: durationHours,
      minutes: durationMinutes,
    },
  }
  if (schedule) {
    model.schedule = schedule
  }
  return model
}
