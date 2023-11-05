import React, { useState } from 'react'
import { CreateNewLinkForm } from './Form'
import { ScheduleComponent } from './Schedule/ScheduleComponent'
import { ScheduleModel } from '@/lib/models/Schedule.model'
import { LinkCreationSuccess } from '@/components/CreateNewLink/LinkCreationSuccess'
import { PageHeader } from '@/components/PageHeader'
import { ErrorPage } from '@/components/ErrorPage'

interface CreateNewLinkComponentProps {
  userId: number | undefined
  timezone: string
  onBackButtonClicked: () => void
}

export function CreateNewLinkComponent({
  userId,
  timezone,
  onBackButtonClicked,
}: CreateNewLinkComponentProps) {
  const [schedule, setSchedule] = useState<ScheduleModel | undefined>()
  const [isLinkCreated, setIsLinkCreated] = useState<boolean | undefined>()

  function isScheduleMode() {
    return !schedule
  }

  function isFormMode() {
    return schedule && !isLinkCreated
  }

  if (!userId) {
    return (
      <div className="flex-1">
        <ErrorPage message={"We couldn't detect a Telegram user"} />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {isScheduleMode() && (
        <>
          <div className="flex-1">
            <PageHeader text={'Choose the time available for booking'} />
          </div>
          <div className="flex-1">
            <ScheduleComponent
              onScheduleSelected={setSchedule}
              onBackButtonClicked={onBackButtonClicked}
            />
          </div>
        </>
      )}

      {isFormMode() && (
        <>
          <div className="flex-1 my-2">
            <PageHeader text={'Choose the duration of any further bookings'} />
          </div>
          <div className="flex-1">
            <CreateNewLinkForm
              userId={userId}
              timezone={timezone}
              schedule={schedule!}
              onLinkCreated={() => {
                setIsLinkCreated(true)
              }}
              onBackButtonClicked={() => {
                setSchedule(undefined)
              }}
            />
          </div>
        </>
      )}

      {isLinkCreated && <LinkCreationSuccess />}
    </div>
  )
}
