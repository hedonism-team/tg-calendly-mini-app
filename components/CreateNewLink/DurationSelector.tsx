import { range } from 'lodash'
import React from 'react'

import { TimeSlotDuration } from '@/lib/models/Link.model'

interface DurationSelectorProps {
  selectedDuration: Partial<TimeSlotDuration>
  onDurationUpdated: (duration: Partial<TimeSlotDuration>) => void
}

const allHours = range(0, 6)
const allMinutes = range(0, 60, 15)

export function DurationSelector({
  selectedDuration,
  onDurationUpdated,
}: DurationSelectorProps) {
  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-row w-80 justify-center">
        <div className="form-control w-16 max-w-xs mx-2">
          <label className="label">
            <span className="label-text">Hours</span>
          </label>
          <select
            defaultValue={undefined}
            required={true}
            className="select select-sm select-bordered max-w-xs"
            onChange={(e) => {
              const hours = Number(e.target.value)
              onDurationUpdated({ hours })
            }}
          >
            {allHours.map((hours) => (
              <option key={hours} selected={hours === selectedDuration.hours}>
                {hours}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control w-16 max-w-xs mx-2">
          <label className="label">
            <span className="label-text">Minutes</span>
          </label>
          <select
            defaultValue={undefined}
            required={true}
            className="select select-sm select-bordered max-w-xs"
            onChange={(e) => {
              const minutes = Number(e.target.value)
              onDurationUpdated({ minutes })
            }}
          >
            {allMinutes.map((minutes) => (
              <option
                key={minutes}
                selected={minutes === selectedDuration.minutes}
              >
                {minutes}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
