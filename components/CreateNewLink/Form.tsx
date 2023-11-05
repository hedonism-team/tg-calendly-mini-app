import { TimeSlotDuration } from '@/lib/models/Link.model'
import { ScheduleModel } from '@/lib/models/Schedule.model'
import React from 'react'

interface CreateNewLinkFormProps {
  userId: number
  timezone: string
  duration: TimeSlotDuration
  schedule: ScheduleModel
  onLinkCreated: () => void
}

export function CreateNewLinkForm({
  userId,
  timezone,
  duration,
  schedule,
}: CreateNewLinkFormProps) {
  return (
    <div>
      <div>{JSON.stringify(duration)}</div>
      <div>{JSON.stringify(schedule)}</div>
    </div>
  )
}
