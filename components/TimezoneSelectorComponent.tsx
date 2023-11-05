import React from 'react'
import { TimezoneSelector } from '@/components/TimezoneSelector'

interface TimezoneSelectorComponentProps {
  timezone: string
  onTimezoneChanged: (timezone: string) => void
}

export function TimezoneSelectorComponent({
  timezone,
  onTimezoneChanged,
}: TimezoneSelectorComponentProps) {
  return (
    <TimezoneSelector
      value={timezone}
      onChange={(option) => {
        onTimezoneChanged(option.value)
      }}
    />
  )
}
