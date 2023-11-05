import React from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import './style.css'
import dayjs from 'dayjs'

export interface CalendarProps {
  date: Date | undefined
  onDateSelected: (date: Date | undefined) => void
}

export function Calendar({ date, onDateSelected }: CalendarProps) {
  const disabledDays = [
    {
      from: dayjs().subtract(50, 'years').toDate(),
      to: dayjs().subtract(1, 'days').toDate(),
    },
  ]

  return (
    <DayPicker
      mode="single"
      selected={date}
      onSelect={onDateSelected}
      disabled={disabledDays}
    />
  )
}
