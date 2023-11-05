import { TimezoneSelectorComponent } from '@/components/TimezoneSelectorComponent'
import { TelegramMainButton } from '@/components/TelegramMainButton'
import React from 'react'

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
    <div className="flex-1 my-2">
      <div className="flex w-full justify-center">
        <div className="w-80">
          <TimezoneSelectorComponent
            timezone={timezone!}
            onTimezoneChanged={onTimezoneChanged}
          />
        </div>
        <TelegramMainButton
          text={'Confirm my timezone'}
          onClick={onTimezoneConfirmed}
        />
      </div>
    </div>
  )
}
