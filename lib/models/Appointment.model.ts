export interface AppointmentModel {
  id: number
  linkId: string
  userId: number
  date: string
  timeSlot: TimeSlot
  email: string
  requestingUserId: number
}

export interface TimeSlot {
  startTime: string // "HH:mm" string in the link creator's timezone
  finishTime: string // "HH:mm" string in the link creator's timezone
}

export enum AppointmentStatus {
  approved = 'approved',
  rejected = 'rejected',
}
