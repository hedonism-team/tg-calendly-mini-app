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

export function CreateNewLinkForm({
  userId,
  timezone,
  schedule,
  onLinkCreated,
  onBackButtonClicked,
}: CreateNewLinkFormProps) {
  const [duration, setDuration] = useState<TimeSlotDuration | undefined>()
  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const requestData: CreateNewLinkPayload = {
        link: {
          userId,
          timezone,
          duration: duration!,
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
    <div>
      <div>{JSON.stringify(duration, null, 2)}</div>
      <div>{JSON.stringify(schedule, null, 2)}</div>
      <form>
        <DurationSelector
          onDurationUpdated={setDuration}
        />
        {error && <span className="text-error">{error?.message}</span>}
        <TelegramMainButton
          disabled={!duration}
          progress={isPending}
          text={isPending ? 'Creating...' : 'Create link'}
          onClick={() => {
            console.log('handleSubmit')
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
  )
}
