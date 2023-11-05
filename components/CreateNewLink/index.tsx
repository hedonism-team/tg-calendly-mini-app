import React, { useState } from 'react'
import { CreateNewLinkForm } from './Form'
import { ScheduleComponent } from './Schedule/ScheduleComponent'
import { ScheduleModel } from '@/lib/models/Schedule.model'

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
      <div className="flex-1 border-b-white my-2">
        <div className="flex w-full justify-center">HEADER</div>
      </div>

      {isScheduleMode() && (
        <div className="flex-1">
          <ScheduleComponent
            onScheduleSelected={setSchedule}
            onBackButtonClicked={onBackButtonClicked}
          />
        </div>
      )}

      {isFormMode() && (
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
      )}

      {isLinkCreated && (
        <div className="flex-1 w-full justify-center">
          Success! Link has been created!
        </div>
      )}
    </div>
  )
}
