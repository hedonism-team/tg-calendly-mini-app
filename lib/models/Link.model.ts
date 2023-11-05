import { ScheduleModel } from '@/lib/models/Schedule.model'

export interface LinkModel {
  id: string
  userId: number
  timezone: string
  duration: TimeSlotDuration
  schedule?: ScheduleModel
}

export interface TimeSlotDuration {
  hours: number
  minutes: number
}
