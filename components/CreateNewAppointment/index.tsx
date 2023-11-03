'use client'

import React from 'react'
import dayjs from 'dayjs'

import { LinkModel } from '@/lib/models/Link.model'
import { CreateNewAppointmentForm } from '@/components/CreateNewAppointment/Form'
import { FreeTimeSlotsComponent } from '@/components/CreateNewAppointment/FreeTimeSlotsComponent'
import { TimeSlot } from '@/lib/models/Appointment.model'

interface CreateNewAppointmentComponentProps {
  link: LinkModel
}

function getDateString(date: Date | undefined) {
  if (!date) {
    return dayjs().format('YYYY-MM-DD')
  }
  return dayjs(date).format('YYYY-MM-DD')
}

export function CreateNewAppointmentComponent({
  link,
}: CreateNewAppointmentComponentProps) {
  const [date, setDate] = React.useState<Date | undefined>(dayjs().toDate())
  const [timeSlot, setTimeSlot] = React.useState<TimeSlot | undefined>()
  const timezone = 'Asia/Srednekolymsk'

  return (
    <div>
      <div className="flex flex-row">
        <div className="basis-1/2">
          {/*<Calendar*/}
          {/*  mode="single"*/}
          {/*  selected={date}*/}
          {/*  onSelect={(date) => setDate(date ?? new Date())}*/}
          {/*  className="rounded-md border"*/}
          {/*/>*/}
        </div>
        <div className="basis-1/2">
          <FreeTimeSlotsComponent
            link={link}
            dateString={getDateString(date)}
            timezone={timezone}
            onTimeSlotSelected={setTimeSlot}
          />
        </div>
      </div>
      <div className="flex flex-row">
        <CreateNewAppointmentForm
          linkId={link.id}
          dateString={getDateString(date)}
          timeSlot={timeSlot}
        />
      </div>
    </div>
  )
}
