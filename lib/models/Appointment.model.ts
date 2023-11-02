export interface AppointmentModel {
  id: number
  linkId: string
  userId: number
  date: string
  timeSlot: TimeSlot
  email: string
}

export interface TimeSlot {
  startTime: string // "HH:mm" string in the link creator's timezone
  finishTime: string // "HH:mm" string in the link creator's timezone
}
