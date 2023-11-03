import { AppointmentModel } from '@/lib/models/Appointment.model'
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

// TODO implement
export async function createNewAppointment() {
  // check validity of the input
  // create new Appointment instance
}
