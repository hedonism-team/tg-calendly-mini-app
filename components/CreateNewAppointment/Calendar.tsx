import React from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import 'react-day-picker/dist/style.css'
import dayjs from 'dayjs'

export interface CalendarProps {
  date: Date | undefined
  onDateSelected: (date: Date | undefined) => void
}

export function Calendar({ date, onDateSelected }: CalendarProps) {
  let footer = <p>Please pick a day.</p>
  if (date) {
    footer = <p>You picked {format(date, 'PP')}.</p>
  }

  // TODO support dateRange + completely booked days
  const disabledDays = [dayjs().add(1, 'day').toDate()]

  return (
    <DayPicker
      mode="single"
      selected={date}
      onSelect={onDateSelected}
      footer={footer}
      disabled={disabledDays}
    />
  )
}
