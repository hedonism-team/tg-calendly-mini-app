import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { ShiftedTimeSlot } from '@/lib/models/Appointment.model'
import { CreateNewAppointmentPayload } from '@/lib/services/appointments.service'

interface CreateNewAppointmentFormProps {
  linkId: string
  requestingUserId: number
  dateString: string
  timeSlot: ShiftedTimeSlot
  requestingUserTimezone: string
  onAppointmentCreated: () => void
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
  onAppointmentCreated,
  requestingUserTimezone,
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
      // TODO already booked & internal error
      setSendError(e)
    },
  })
  const onSubmit: SubmitHandler<FormValues> = (data) => mutate(data)

  return (
    <div className="flex w-full justify-center">
      <div className="w-80">
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <div className="flex w-full justify-center">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isPending}
            >
              {isPending ? 'Sending...' : 'Send appointment request'}
            </button>
            {sendError?.message && (
              <div className="text-error">
                <span>{sendError?.message}</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
