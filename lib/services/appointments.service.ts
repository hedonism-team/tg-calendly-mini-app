import { AppointmentModel, TimeSlot } from '@/lib/models/Appointment.model'
import { fakeAppointment } from '@/tests/fakers/appointments.faker'
import { DateRange } from '@/lib/services/timeSlots.service'

// TODO implement: fetch from DB
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
  return [fakeAppointment()] as AppointmentModel[]
}

export interface CreateNewAppointmentPayload {
  linkId: string
  date: string
  timeSlot: TimeSlot
  email: string
}

// TODO implement
export async function createNewAppointment(
  payload: CreateNewAppointmentPayload
) {
  // create new Appointment instance
}
