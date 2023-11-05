import React from 'react'
import { TelegramMainButton } from '@/components/TelegramMainButton'
import { PageHeader } from '@/components/PageHeader'
import { TimezoneSelector } from '@/components/TimezoneSelector'

interface ConfirmTimezoneComponentProps {
  timezone: string
  onTimezoneChanged: (timezone: string) => void
  onTimezoneConfirmed: () => void
}

export function ConfirmTimezoneComponent({
  timezone,
  onTimezoneChanged,
  onTimezoneConfirmed,
}: ConfirmTimezoneComponentProps) {
  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <PageHeader text={'Confirm your timezone'} />
      </div>
      <div className="flex-1">
        <div className="flex w-full mt-36 justify-center">
          <div className="w-80">
            <TimezoneSelector
              value={timezone}
              onChange={(option) => {
                onTimezoneChanged(option.value)
              }}
            />
          </div>
          <TelegramMainButton
            text={'Confirm my timezone'}
            onClick={onTimezoneConfirmed}
          />
        </div>
      </div>
    </div>
  )
}
