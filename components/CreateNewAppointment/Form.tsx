import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { ShiftedTimeSlot } from '@/lib/models/Appointment.model'
import { CreateNewAppointmentPayload } from '@/lib/services/appointments.service'
import { TelegramBackButton } from '@/components/TelegramBackButton'
import { TelegramMainButton } from '@/components/TelegramMainButton'

interface CreateNewAppointmentFormProps {
  linkId: string
  requestingUserId: number
  dateString: string
  timeSlot: ShiftedTimeSlot
  requestingUserTimezone: string
  onAppointmentCreated: () => void
  onBackButtonClicked: () => void
}

interface FormValues {
  email: string
}

const schema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
})

export function CreateNewAppointmentForm({
  linkId,
  timeSlot,
  dateString,
  requestingUserId,
  requestingUserTimezone,
  onAppointmentCreated,
  onBackButtonClicked,
}: CreateNewAppointmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })
  const [sendError, setSendError] = useState<Error | undefined>()
  const { mutate, isPending } = useMutation({
    mutationFn: async (formValues: FormValues) => {
      const requestData: CreateNewAppointmentPayload = {
        linkId,
        requestingUserId,
        date: timeSlot.originalDate,
        timeSlot: {
          startTime: timeSlot.originalStartTime,
          finishTime: timeSlot.originalFinishTime,
        },
        ...formValues,
      }
      const response = await fetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create appointment')
      }

      return response.json()
    },
    onSuccess: async () => {
      reset()
      onAppointmentCreated()
    },
    onError: async (e) => {
      setSendError(e) // N.B. already booked & internal error
    },
  })
  const onSubmit: SubmitHandler<FormValues> = (data) => mutate(data)

  return (
    <div className="flex w-full justify-center">
      <div className="w-80">
        <form>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Your timezone</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs input-disabled"
              value={requestingUserTimezone}
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Selected date</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs input-disabled"
              value={dateString}
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Selected time slot</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs input-disabled"
              value={`${timeSlot.startTime} - ${timeSlot.finishTime}`}
            />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              {...register('email', { required: true })}
              placeholder="Type your email here..."
            />
            <label className="label">
              {errors.email?.message && (
                <span className="label-text-alt text-error">
                  {errors.email?.message}
                </span>
              )}
            </label>
          </div>
        </form>
        <TelegramBackButton
          onClick={() => {
            reset()
            onBackButtonClicked()
          }}
        />
        <TelegramMainButton
          progress={isPending}
          disabled={Boolean(errors.email?.message)}
          text={isPending ? 'Sending...' : 'Send appointment request'}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </div>
  )
}
