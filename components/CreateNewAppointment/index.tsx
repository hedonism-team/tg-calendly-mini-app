import React, { useCallback, useState } from 'react'
import dayjs from 'dayjs'
import { useQueryClient } from '@tanstack/react-query'

import { ShiftedTimeSlot } from '@/lib/models/Appointment.model'
import { Calendar } from './Calendar/Calendar'
import { FreeTimeSlotsComponent } from './FreeTimeSlotsComponent'
import { CreateNewAppointmentForm } from './Form'
import { TelegramBackButton } from '@/components/TelegramBackButton'
import { AppointmentCreationSuccess } from '@/components/CreateNewAppointment/AppointmentCreationSuccess'
import { ErrorPage } from '@/components/ErrorPage'
import { PageHeader } from '@/components/PageHeader'
import { UserModel } from '@/lib/models/User.model'
import { LinkModel } from '@/lib/models/Link.model'
import { CreateAppointmentPageHeader } from '@/components/CreateNewAppointment/CreateAppointmentPageHeader'
import { useEnsureLink } from '@/components/useEnsureLink.effect'

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
  const [date, setDate] = useState<Date | undefined>(dayjs().toDate())
  const [timeSlot, setTimeSlot] = useState<ShiftedTimeSlot | undefined>()
  const [isAppointmentCreated, setIsAppointmentCreated] = useState<
    boolean | undefined
  >()

  const [link, setLink] = useState<LinkModel | undefined | null>()
  const [linkOwner, setLinkOwner] = useState<UserModel | undefined | null>()
  const wrappedSetLinkOwner = useCallback(
    (data: { link: LinkModel | null; owner: UserModel | null }) => {
      setLink(data.link)
      setLinkOwner(data.owner)
    },
    []
  )
  useEnsureLink(linkId, wrappedSetLinkOwner)

  function isDateTimeMode() {
    return (!date || !timeSlot) && !isAppointmentCreated
  }

  function isFormMode() {
    return date && timeSlot && !isAppointmentCreated
  }

  if (!userId) {
    return (
      <div className="flex-1">
        <ErrorPage message={"We couldn't detect a Telegram user"} />
      </div>
    )
  }

  if (link === null) {
    return (
      <div className="flex-1">
        <ErrorPage message={'Oops! Most likely this link does not exist'} />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {isDateTimeMode() && (
        <>
          <div className="flex-1">
            {!linkOwner && (
              <PageHeader text={'Choose suitable date and time slot'} />
            )}
            {linkOwner && <CreateAppointmentPageHeader linkOwner={linkOwner} />}
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

          <TelegramBackButton
            onClick={() => {
              onBackButtonClicked()
            }}
          />
        </>
      )}

      {isFormMode() && (
        <>
          <div className="flex-1">
            <PageHeader text={'Confirm appointment details'} />
          </div>
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

      {isAppointmentCreated && <AppointmentCreationSuccess />}
    </div>
  )
}
