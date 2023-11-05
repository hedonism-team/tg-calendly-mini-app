'use client'

import React from 'react'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'

import { ShiftedTimeSlot } from '@/lib/models/Appointment.model'
import { Calendar } from './Calendar'
import { FreeTimeSlotsComponent } from './FreeTimeSlotsComponent'
import { CreateNewAppointmentForm } from './Form'
import { TimezoneSelectorComponent } from '@/components/TimezoneSelectorComponent'

interface CreateNewAppointmentComponentProps {
  linkId: string
  userId: number | undefined
}

function getDateString(date: Date | undefined) {
  if (!date) {
    return dayjs().format('YYYY-MM-DD')
  }
  return dayjs(date).format('YYYY-MM-DD')
}

export function CreateNewAppointmentComponent({
  linkId,
  userId,
}: CreateNewAppointmentComponentProps) {
  function getDefaultTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  const queryClient = useQueryClient()
  const [timezone, setTimezone] = React.useState<string>(getDefaultTimezone())
  const [date, setDate] = React.useState<Date | undefined>(dayjs().toDate())
  const [timeSlot, setTimeSlot] = React.useState<ShiftedTimeSlot | undefined>()

  function isFormMode() {
    return timezone && date && timeSlot
  }

  if (!userId) {
    return <div>NewAppointment: userId is not defined</div>
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 border-b-white my-2">
        <div className="flex w-full justify-center">HEADER</div>
      </div>

      {!isFormMode() && (
        <div>
          <div className="flex-1">
            <div className="flex w-full justify-center">
              <div className="w-80">
                <TimezoneSelectorComponent
                  timezone={timezone}
                  onTimezoneChanged={(timezone) => {
                    setTimezone(timezone)
                    setTimeSlot(undefined)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex w-full justify-center">
              <div className="w-80">
                <Calendar
                  date={date}
                  onDateSelected={(date) => {
                    setDate(date ?? new Date())
                    setTimeSlot(undefined)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <FreeTimeSlotsComponent
              linkId={linkId}
              timezone={timezone}
              dateString={getDateString(date)}
              onTimeSlotSelected={setTimeSlot}
            />
          </div>
        </div>
      )}
      {isFormMode() && (
        <div className="flex-1">
          <CreateNewAppointmentForm
            linkId={linkId}
            timeSlot={timeSlot!}
            requestingUserId={userId}
            requestingUserTimezone={timezone}
            dateString={getDateString(date)}
            onAppointmentCreated={async () => {
              setTimeSlot(undefined)
              await queryClient.invalidateQueries()
            }}
          />
        </div>
      )}
    </div>
  )
}
