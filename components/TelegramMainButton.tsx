import React from 'react'
import { MainButton } from '@twa-dev/sdk/dist/react'

interface TelegramMainButtonProps {
  onClick: () => void
  text?: string
  disabled?: boolean
  type?: string
  progress?: boolean
}

export function TelegramMainButton({
  text,
  onClick,
  disabled,
  progress,
}: TelegramMainButtonProps) {
  return (
    <>
      {typeof window !== 'undefined' && (
        <MainButton
          text={text ?? 'OK'}
          onClick={onClick}
          progress={progress ?? false}
          disabled={disabled ?? false}
        />
      )}
    </>
  )
}
