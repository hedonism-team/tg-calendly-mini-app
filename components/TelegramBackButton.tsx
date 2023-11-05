import React from 'react'
import { BackButton } from '@twa-dev/sdk/dist/react'

export function TelegramBackButton() {
  return (
    <>
      {typeof window !== 'undefined' && (
        <BackButton onClick={() => alert('BackButton')} />
      )}
    </>
  )
}
