import { TimeSlotDuration } from '@/lib/models/Link.model'
import { Schedule } from '@prisma/client'

interface CreateNewLinkFormProps {
  linkId: string
  userId: number
  timezone: string
  duration: TimeSlotDuration
  schedule: Schedule
  onLinkCreated: () => void
}

export function CreateNewLinkForm({}: CreateNewLinkFormProps) {
  return <div></div>
}
