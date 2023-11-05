import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import { TimeSlotDuration } from '@/lib/models/Link.model'
import { ScheduleModel } from '@/lib/models/Schedule.model'
import { TelegramBackButton } from '@/components/TelegramBackButton'
import { TelegramMainButton } from '@/components/TelegramMainButton'
import { CreateNewLinkPayload } from '@/app/api/links/route'
import { DurationSelector } from '@/components/CreateNewLink/DurationSelector'

interface CreateNewLinkFormProps {
  userId: number
  timezone: string
  schedule: ScheduleModel
  onLinkCreated: () => void
  onBackButtonClicked: () => void
}

const defaultDurationHours = 1
const defaultDurationMinutes = 0

export function CreateNewLinkForm({
  userId,
  timezone,
  schedule,
  onLinkCreated,
  onBackButtonClicked,
}: CreateNewLinkFormProps) {
  const [duration, setDuration] = useState<Partial<TimeSlotDuration>>({
    hours: defaultDurationHours,
    minutes: defaultDurationMinutes,
  })
  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const requestData: CreateNewLinkPayload = {
        link: {
          userId,
          timezone,
          duration: duration as TimeSlotDuration,
        },
        schedule,
      }
      const response = await fetch('/api/links', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create link')
      }

      return response.json()
    },
    onSuccess: async () => {
      onLinkCreated()
    },
  })

  return (
    <div className="flex w-full justify-center">
      <div className="w-80 mt-36">
        <form>
          <DurationSelector
            selectedDuration={duration}
            onDurationUpdated={(updatedDuration: Partial<TimeSlotDuration>) => {
              setDuration(getUpdatedDuration(duration, updatedDuration))
            }}
          />
          {error && <span className="text-error">{error?.message}</span>}
          <TelegramMainButton
            progress={isPending}
            disabled={!isDurationSelected(duration)}
            text={isPending ? 'Creating...' : 'Create link'}
            onClick={() => {
              mutate()
            }}
          />
        </form>
        <TelegramBackButton
          onClick={() => {
            onBackButtonClicked()
          }}
        />
      </div>
    </div>
  )
}

// private

function isDurationSelected(duration: Partial<TimeSlotDuration>) {
  return !(
    duration.hours === undefined ||
    duration.minutes === undefined ||
    (duration.hours === 0 && duration.minutes === 0)
  )
}

function getUpdatedDuration(
  duration: Partial<TimeSlotDuration>,
  updatedDuration: Partial<TimeSlotDuration>
) {
  return {
    ...duration,
    ...updatedDuration,
  }
}
