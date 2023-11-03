import type { Appointment } from '@prisma/client'
import prisma from '@/lib/prisma'
import { DateRange } from '@/lib/services/timeSlots.service'
import { AppointmentModel, TimeSlot } from '@/lib/models/Appointment.model'

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
  return await prisma.appointment.create({
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
}: Appointment) {
  return {
    id,
    linkId,
    userId,
    requestingUserId,
    date,
    timeSlot: {
      startTime: timeSlotStartTime,
      finishTime: timeSlotFinishTime,
    },
    email,
  } as AppointmentModel
}
