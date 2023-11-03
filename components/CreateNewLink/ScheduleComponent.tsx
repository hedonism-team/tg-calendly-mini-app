import { Schedule } from '@prisma/client'

interface ScheduleComponentProps {
  schedule: Schedule | undefined
  onScheduleUpdated: (schedule: Schedule) => void
}

export function ScheduleComponent({
  schedule,
  onScheduleUpdated,
}: ScheduleComponentProps) {
  if (!schedule) {
    return <div></div>
  }
  return <div></div>
}
