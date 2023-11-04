import type { Appointment } from '@prisma/client'
import prisma from '@/lib/prisma'
import { DateRange } from '@/lib/services/timeSlots.service'
import {
  AppointmentModel,
  AppointmentStatus,
  TimeSlot,
} from '@/lib/models/Appointment.model'
import { createOrUpdateUser } from '@/lib/services/users.service'

// TODO implement: date range filtering
/**
 *
 * @param userId - host's id
 * @param start
 * @param end
 */
export async function getAllUserAppointmentsForDate(
  userId: number,
  { start, finish }: DateRange
) {
  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
    },
  })
  return appointments.map(mapDbAppointmentToModel)
}

export interface CreateNewAppointmentPayload {
  linkId: string
  requestingUserId: number
  date: string
  timeSlot: TimeSlot
  email: string
}

export async function createNewAppointment({
  linkId,
  requestingUserId,
  date,
  timeSlot,
  email,
}: CreateNewAppointmentPayload) {
  const link = await prisma.link.findUniqueOrThrow({
    where: {
      id: linkId,
    },
  })

  await createOrUpdateUser({ id: requestingUserId })

  return mapDbAppointmentToModel(
    await prisma.appointment.create({
      data: {
        linkId,
        userId: link.userId,
        requestingUserId,
        date,
        timeSlotStartTime: timeSlot.startTime,
        timeSlotFinishTime: timeSlot.finishTime,
        email,
      },
    })
  )
}

export async function getAppointmentById(id: number) {
  return mapDbAppointmentToModel(
    await prisma.appointment.findUniqueOrThrow({ where: { id } })
  )
}

export async function updateAppointmentStatus(
  id: number,
  status: AppointmentStatus
) {
  return mapDbAppointmentToModel(
    await prisma.appointment.update({ where: { id }, data: { status } })
  )
}

// private

function mapDbAppointmentToModel({
  id,
  linkId,
  userId,
  requestingUserId,
  date,
  timeSlotStartTime,
  timeSlotFinishTime,
  email,
  status,
}: Appointment) {
  return {
    id,
    linkId,
    userId: Number.parseInt(userId.toString()),
    requestingUserId: Number.parseInt(requestingUserId.toString()),
    date,
    timeSlot: {
      startTime: timeSlotStartTime,
      finishTime: timeSlotFinishTime,
    },
    email,
    status,
  } as AppointmentModel
}
