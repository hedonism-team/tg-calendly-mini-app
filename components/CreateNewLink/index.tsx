'use client'

import React from 'react'
import { Schedule } from '@prisma/client'

import { TimeSlotDuration } from '@/lib/models/Link.model'
import { CreateNewLinkForm } from './Form'
import { DurationSelector } from './DurationSelector'
import { ScheduleComponent } from './ScheduleComponent'
import { TimezoneSelectorComponent } from '@/components/TimezoneSelectorComponent'
import { LinkIdPicker } from '@/components/CreateNewLink/LinkIdPicker'
import { TelegramMainButton } from '@/components/TelegramMainButton'
import { TelegramEnvGuard } from '@/components/TelegramEnvGuard'

interface CreateNewLinkComponentProps {
  env: string // TODO remove
}

export function CreateNewLinkComponent({ env }: CreateNewLinkComponentProps) {
  function getDefaultTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  const [timezone, setTimezone] = React.useState<string>(getDefaultTimezone())
  const [duration, setDuration] = React.useState<TimeSlotDuration>({
    hours: 1,
    minutes: 0,
  })
  const [schedule, setSchedule] = React.useState<Schedule | undefined>()
  const [linkId, setLinkId] = React.useState<string | undefined>()
  const [userId, setUserId] = React.useState<number | undefined>()
  // const userId = 53698235 // TODO pass tgUserId

  return (
    <>
      <TelegramEnvGuard onUserDetected={setUserId} />
      {userId && (
        <>
          <div className="grid grid-flow-row sm:max-w-sm xs:max-w-xs">
            <div className="flex-1">
              <TimezoneSelectorComponent
                timezone={timezone}
                onTimezoneChanged={setTimezone}
              />
            </div>

            <div className="flex-1">
              <ScheduleComponent
                schedule={schedule}
                onScheduleUpdated={setSchedule}
              />
            </div>

            <div className="flex-1">
              <DurationSelector
                duration={duration}
                onDurationSelected={setDuration}
              />
            </div>

            {duration && (
              <p className="flex-1 text-red-600">
                Selected slot duration: {duration.hours}h {duration.minutes}m
              </p>
            )}

            <div className="flex-1">
              <LinkIdPicker />
            </div>

            <div className="flex-1">
              {duration && schedule && linkId && (
                <CreateNewLinkForm
                  linkId={linkId}
                  userId={userId}
                  timezone={timezone}
                  duration={duration}
                  schedule={schedule}
                  onLinkCreated={() => {}}
                />
              )}
            </div>
          </div>

          <TelegramMainButton />
        </>
      )}
    </>
  )
}
