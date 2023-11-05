'use client'

import React, { useState } from 'react'

import { TimeSlotDuration } from '@/lib/models/Link.model'
import { CreateNewLinkForm } from './Form'
import { DurationSelector } from './DurationSelector'
import { ScheduleComponent } from './ScheduleComponent'
import { TimezoneSelectorComponent } from '@/components/TimezoneSelectorComponent'
import { ScheduleModel } from '@/lib/models/Schedule.model'
import { TelegramMainButton } from '@/components/TelegramMainButton'

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
  const [isTimezoneConfirmed, setIsTimezoneConfirmed] = useState<boolean>(false)
  const [duration, setDuration] = useState<TimeSlotDuration | undefined>()
  const [schedule, setSchedule] = useState<ScheduleModel | undefined>()
  const [isLinkCreated, setIsLinkCreated] = useState<boolean | undefined>()

  function isTimezoneConfirmationMode() {
    return !isTimezoneConfirmed
  }

  function isDurationMode() {
    return isTimezoneConfirmed && !duration
  }

  function isScheduleMode() {
    return duration && !schedule
  }

  function isFormMode() {
    return duration && schedule && !isLinkCreated
  }

  if (!userId) {
    return <div>NewLink: userId is not defined</div>
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 border-b-white my-2">
        <div className="flex w-full justify-center">HEADER</div>
      </div>

      {isTimezoneConfirmationMode() && (
        <div className="flex-1 my-2">
          <div className="flex w-full justify-center">
            <div className="w-80">
              <TimezoneSelectorComponent
                timezone={timezone}
                onTimezoneChanged={setTimezone}
              />
            </div>
          </div>
          <TelegramMainButton
            text={'Confirm my timezone'}
            onClick={() => setIsTimezoneConfirmed(true)}
          />
        </div>
      )}

      {isDurationMode() && (
        <div className="flex-1">
          <DurationSelector
            onDurationSelected={setDuration}
            onBackButtonClicked={() => {
              setIsTimezoneConfirmed(false)
            }}
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

      {isLinkCreated && <div>Success! Link has been created!s</div>}
    </div>
  )
}
