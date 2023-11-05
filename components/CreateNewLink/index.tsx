'use client'

import React, { useState } from 'react'

import { TimeSlotDuration } from '@/lib/models/Link.model'
import { CreateNewLinkForm } from './Form'
import { DurationSelector } from './DurationSelector'
import { ScheduleComponent } from './ScheduleComponent'
import { TimezoneSelectorComponent } from '@/components/TimezoneSelectorComponent'
import { ScheduleModel } from '@/lib/models/Schedule.model'

interface CreateNewLinkComponentProps {
  userId: number | undefined
}

export function CreateNewLinkComponent({
  userId,
}: CreateNewLinkComponentProps) {
  function getDefaultTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  const [timezone, setTimezone] = useState<string>(getDefaultTimezone())
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
    return duration && schedule
  }

  if (!userId) {
    return <div>NewLink: userId is not defined</div>
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 border-b-white my-2">
        <div className="flex w-full justify-center">HEADER</div>
      </div>

      {isDurationMode() && (
        <>
          <div className="flex-1 my-2">
            <div className="flex w-full justify-center">
              <div className="w-80">
                <TimezoneSelectorComponent
                  timezone={timezone}
                  onTimezoneChanged={setTimezone}
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <DurationSelector
              onDurationSelected={setDuration}
              onBackButtonClicked={() => {
                setDuration(undefined)
              }}
            />
          </div>
        </>
      )}

      {isScheduleMode() && (
        <div className="flex-1">
          <ScheduleComponent
            onScheduleSelected={setSchedule}
            onBackButtonClicked={() => {
              setSchedule(undefined)
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
          />
        </div>
      )}

      {isLinkCreated && <div>Success! Link has been created!s</div>}
    </div>
  )
}
