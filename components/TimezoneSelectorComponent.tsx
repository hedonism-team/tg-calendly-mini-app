import React from 'react'
import TimezoneSelect from 'react-timezone-select'

interface TimezoneSelectorComponentProps {
  timezone: string
  onTimezoneChanged: (timezone: string) => void
}

export function TimezoneSelectorComponent({
  timezone,
  onTimezoneChanged,
}: TimezoneSelectorComponentProps) {
  return (
    <div>
      <TimezoneSelect
        value={timezone}
        onChange={(option) => {
          onTimezoneChanged(option.value)
        }}
      />
      <p>Your timezone: {timezone}</p>
    </div>
  )
}
