import React, { useState } from 'react'

import { TimeSlotDuration } from '@/lib/models/Link.model'
import { CreateNewLinkForm } from './Form'
import { DurationSelector } from './DurationSelector'
import { ScheduleComponent } from './ScheduleComponent'
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
  const [duration, setDuration] = useState<TimeSlotDuration | undefined>()
  const [schedule, setSchedule] = useState<ScheduleModel | undefined>()
  const [isLinkCreated, setIsLinkCreated] = useState<boolean | undefined>()

  function isDurationMode() {
    return !duration
  }

  function isScheduleMode() {
    return duration && !schedule
  }

  function isFormMode() {
    return duration && schedule && !isLinkCreated
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

      {isDurationMode() && (
        <div className="flex-1">
          <DurationSelector
            onDurationSelected={setDuration}
            onBackButtonClicked={onBackButtonClicked}
          />
        </div>
      )}

      {isScheduleMode() && (
        <div className="flex-1">
          <ScheduleComponent
            onScheduleSelected={setSchedule}
            onBackButtonClicked={() => {
              setDuration(undefined)
            }}
          />
        </div>
      )}

      {isFormMode() && (
        <div className="flex-1">
          <CreateNewLinkForm
            userId={userId}
            timezone={timezone}
            duration={duration!}
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
