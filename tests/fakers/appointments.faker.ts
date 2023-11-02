import { AppointmentModel } from '@/lib/models/Appointment.model'
import dayjs from 'dayjs'

export function fakeAppointment(overrides: Partial<AppointmentModel> = {}) {
  return {
    id: 1,
    linkId: 'my-link',
    userId: 1,
    date: dayjs().format('YYYY-MM-DD'),
    timeSlot: {
      startTime: '10:00',
      finishTime: '11:00',
    },
    email: 'alex@meetly.cc',
  } as AppointmentModel
}
