import React, { useState } from 'react'
import { CreateNewLinkForm } from './Form'
import { ScheduleComponent } from './Schedule/ScheduleComponent'
import { ScheduleModel } from '@/lib/models/Schedule.model'
import { LinkCreationSuccess } from '@/components/CreateNewLink/LinkCreationSuccess'

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

  // TODO remove
  if (!userId) {
    return <div>NewLink: userId is not defined</div>
  }

  return (
    <div className="flex flex-col">
      {isScheduleMode() && (
        <>
          <div className="flex-1 border-b-white my-2">
            <div className="flex w-full justify-center">
              Choose the time available for booking
            </div>
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
          <div className="flex-1 border-b-white my-2">
            <div className="flex w-full justify-center">
              Choose the duration of any further bookings
            </div>
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
