import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'

import { TimeSlotDuration } from '@/lib/models/Link.model'
import { ScheduleModel } from '@/lib/models/Schedule.model'
import { TelegramBackButton } from '@/components/TelegramBackButton'
import { TelegramMainButton } from '@/components/TelegramMainButton'
import { CreateNewLinkPayload } from '@/app/api/links/route'

interface CreateNewLinkFormProps {
  userId: number
  timezone: string
  duration: TimeSlotDuration
  schedule: ScheduleModel
  onLinkCreated: () => void
  onBackButtonClicked: () => void
}

export function CreateNewLinkForm({
  userId,
  timezone,
  duration,
  schedule,
  onLinkCreated,
  onBackButtonClicked,
}: CreateNewLinkFormProps) {
  const { handleSubmit } = useForm()
  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const requestData: CreateNewLinkPayload = {
        link: {
          userId,
          timezone,
          duration,
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
  const onSubmit: SubmitHandler<any> = () => mutate()

  return (
    <div>
      <div>{JSON.stringify(duration)}</div>
      <div>{JSON.stringify(schedule)}</div>
      <form>
        {error && <span className="text-error">{error?.message}</span>}
        <TelegramMainButton
          text={'Create link'}
          onClick={() => handleSubmit(onSubmit)}
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
