import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { TimeSlot } from '@/lib/models/Appointment.model'

interface CreateNewAppointmentFormProps {
  linkId: string
  dateString: string | undefined
  timeSlot: TimeSlot | undefined
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
  onAppointmentCreated,
}: CreateNewAppointmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })
  const { mutate, isPending } = useMutation({
    mutationFn: async (formValues: FormValues) => {
      const requestData = {
        linkId,
        date: dateString,
        timeSlot,
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
        throw new Error('Failed to update user')
      }

      return response.json()
    },
    onSuccess: async () => {
      reset()
      onAppointmentCreated()
    },
    onError: async () => {
      // TODO already booked & internal error
    },
  })
  const onSubmit: SubmitHandler<FormValues> = (data) => mutate(data)

  if (!dateString || !timeSlot) {
    return <div>Select params to book an appointment</div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-blue-600">
      <input
        {...register('email', { required: true })}
        placeholder="Type your email here..."
      />
      {errors.email?.message && (
        <p className="text-red-600">{errors.email?.message}</p>
      )}
      <br />
      <button className="btn" type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send meet request'}
      </button>
    </form>
  )
}
