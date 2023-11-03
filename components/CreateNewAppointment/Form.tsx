import React from 'react'
import { TimeSlot } from '@/lib/models/Appointment.model'

interface CreateNewAppointmentFormProps {
  linkId: string
  dateString: string | undefined
  timeSlot: TimeSlot | undefined
}

export function CreateNewAppointmentForm({
  linkId,
  timeSlot,
  dateString,
}: CreateNewAppointmentFormProps) {
  if (!dateString || !timeSlot) {
    return <div>Select params to book an appointment</div>
  }
  // TODO useMutation
  return (
    <form>
      <button className={'btn'} type={'submit'}>
        Create
      </button>
    </form>
  )
}
