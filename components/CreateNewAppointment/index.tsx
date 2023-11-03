'use client'

import React from 'react'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'

import { LinkModel } from '@/lib/models/Link.model'
import { TimeSlot } from '@/lib/models/Appointment.model'
import { Calendar } from './Calendar'
import { FreeTimeSlotsComponent } from './FreeTimeSlotsComponent'
import { CreateNewAppointmentForm } from './Form'
import { TimezoneSelectorComponent } from './TimezoneSelectorComponent'

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
  function getDefaultTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  const queryClient = useQueryClient()
  const [timezone, setTimezone] = React.useState<string>(getDefaultTimezone())
  const [date, setDate] = React.useState<Date | undefined>(dayjs().toDate())
  const [timeSlot, setTimeSlot] = React.useState<TimeSlot | undefined>()
  const userId = 53698235

  return (
    <div className="grid grid-flow-row sm:max-w-sm xs:max-w-xs">
      <div className="flex-1">
        <TimezoneSelectorComponent
          timezone={timezone}
          onTimezoneChanged={setTimezone}
        />
      </div>

      <div className="flex-1">
        <Calendar
          date={date}
          onDateSelected={(date) => setDate(date ?? new Date())}
        />
      </div>

      <div className="flex-1">
        <FreeTimeSlotsComponent
          link={link}
          dateString={getDateString(date)}
          timezone={timezone}
          onTimeSlotSelected={setTimeSlot}
        />
      </div>

      {timeSlot && (
        <p className="flex-1 text-red-600">
          Selected time slot: {timeSlot.startTime} - {timeSlot.finishTime}
        </p>
      )}

      <div className="flex-1">
        {date && timeSlot && (
          <CreateNewAppointmentForm
            linkId={link.id}
            timeSlot={timeSlot}
            requestingUserId={userId}
            dateString={getDateString(date)}
            onAppointmentCreated={async () => {
              setTimeSlot(undefined)
              await queryClient.invalidateQueries()
            }}
          />
        )}
      </div>
    </div>
  )
}
