import React from 'react'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'

import { ShiftedTimeSlot } from '@/lib/models/Appointment.model'
import { Calendar } from './Calendar'
import { FreeTimeSlotsComponent } from './FreeTimeSlotsComponent'
import { CreateNewAppointmentForm } from './Form'
import { TelegramBackButton } from '@/components/TelegramBackButton'

interface CreateNewAppointmentComponentProps {
  linkId: string
  userId: number | undefined
  timezone: string
  onBackButtonClicked: () => void
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
  timezone,
  onBackButtonClicked,
}: CreateNewAppointmentComponentProps) {
  const queryClient = useQueryClient()
  const [date, setDate] = React.useState<Date | undefined>(dayjs().toDate())
  const [timeSlot, setTimeSlot] = React.useState<ShiftedTimeSlot | undefined>()
  const [isAppointmentCreated, setIsAppointmentCreated] = React.useState<
    boolean | undefined
  >()

  function isFormMode() {
    return date && timeSlot
  }

  // TODO remove
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

          <TelegramBackButton
            onClick={() => {
              onBackButtonClicked()
            }}
          />
        </div>
      )}
      {isFormMode() && (
        <>
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
                setIsAppointmentCreated(true)
              }}
              onBackButtonClicked={() => {
                setTimeSlot(undefined)
              }}
            />
          </div>
        </>
      )}
      {isAppointmentCreated && (
        <div className="flex-1 w-full justify-center">
          Success! Link has been created!
        </div>
      )}
    </div>
  )
}
