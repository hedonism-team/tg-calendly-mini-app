import React from 'react'
import { BackButton } from '@twa-dev/sdk/dist/react'

interface TelegramBackButtonProps {
  onClick: () => void
}

export function TelegramBackButton({ onClick }: TelegramBackButtonProps) {
  return (
    <>{typeof window !== 'undefined' && <BackButton onClick={onClick} />}</>
  )
}
