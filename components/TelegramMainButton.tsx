import React from 'react'
import { MainButton } from '@twa-dev/sdk/dist/react'

interface TelegramMainButtonProps {
  onClick: () => void
  text?: string
  disabled?: boolean
  type?: string
}

export function TelegramMainButton({
  onClick,
  text,
  disabled,
}: TelegramMainButtonProps) {
  return (
    <>
      {typeof window !== 'undefined' && (
        <MainButton
          disabled={disabled ?? false}
          text={text ?? 'OK'}
          onClick={onClick}
        />
      )}
    </>
  )
}
