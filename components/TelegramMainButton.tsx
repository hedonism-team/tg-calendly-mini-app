import React from 'react'
import { MainButton } from '@twa-dev/sdk/dist/react'

interface TelegramMainButtonProps {
  text: string
  onClick: () => void
}

export function TelegramMainButton({ onClick, text }: TelegramMainButtonProps) {
  return (
    <>
      {typeof window !== 'undefined' && (
        <MainButton text={text} onClick={onClick} />
      )}
    </>
  )
}
