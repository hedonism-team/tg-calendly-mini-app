import { ScheduleType } from '@/lib/models/Schedule.model'

export interface LinkModel {
  id: string
  userId: number
  timezone: string
  // dateRange
  duration: TimeSlotDuration
  schedule?: ScheduleType
}

export interface TimeSlotDuration {
  hours: number
  minutes: number
}
