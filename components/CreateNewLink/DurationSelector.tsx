import { TimeSlotDuration } from '@/lib/models/Link.model'
import React, { useState } from 'react'
import { range } from 'lodash'
import { TelegramBackButton } from '@/components/TelegramBackButton'
import { TelegramMainButton } from '@/components/TelegramMainButton'

interface DurationSelectorProps {
  onDurationSelected: (duration: TimeSlotDuration) => void
  onBackButtonClicked: () => void
}

const allHours = range(0, 24)
const allMinutes = range(0, 60, 15)

export function DurationSelector({
  onDurationSelected,
  onBackButtonClicked,
}: DurationSelectorProps) {
  const [durationHours, setDurationHours] = useState<number | undefined>()
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>()

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-row w-80 justify-center">
        <div className="form-control w-16 max-w-xs mx-2">
          <label className="label">
            <span className="label-text">Hours</span>
          </label>
          <select
            className="select select-sm select-bordered max-w-xs"
            onChange={(e) => {
              const hours = Number(e.target.value)
              setDurationHours(hours)
            }}
          >
            {allHours.map((hours) => (
              <option key={hours} selected={hours === durationHours}>
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
            className="select select-sm select-bordered max-w-xs"
            onChange={(e) => {
              const minutes = Number(e.target.value)
              setDurationMinutes(minutes)
            }}
          >
            {allMinutes.map((minutes) => (
              <option key={minutes} selected={minutes === durationMinutes}>
                {minutes}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/*<TelegramBackButton*/}
      {/*  onClick={() => {*/}
      {/*    setDurationHours(undefined)*/}
      {/*    setDurationMinutes(undefined)*/}
      {/*    onBackButtonClicked()*/}
      {/*  }}*/}
      {/*/>*/}
      <TelegramMainButton
        text={'Save appointment duration'}
        disabled={durationHours === undefined || durationMinutes === undefined}
        onClick={() =>
          onDurationSelected({
            hours: durationHours!,
            minutes: durationMinutes!,
          })
        }
      />
    </div>
  )
}

// private
