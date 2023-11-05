import { TimezoneSelectorComponent } from '@/components/TimezoneSelectorComponent'
import { TelegramMainButton } from '@/components/TelegramMainButton'
import React from 'react'
import { PageHeader } from '@/components/PageHeader'

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
    <>
      <div className="flex-1">
        <PageHeader text={'Confirm your timezone'} />
      </div>
      <div className="flex-1">
        <div className="flex w-full mt-16 justify-center">
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
    </>
  )
}
