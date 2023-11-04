import React from 'react'
import { Telegram, WebAppUser } from '@twa-dev/types'

interface TelegramUserIdProps {
  onUserDetected: (userId: number) => void
}

interface Window {
  Telegram: Telegram & { WebAppUser: WebAppUser }
}

export function TelegramEnvGuard({ onUserDetected }: TelegramUserIdProps) {
  // const [userId, setUserId] = React.useState<number | undefined>()
  const [telegramUser, setTelegramUser] = React.useState<
    WebAppUser | undefined
  >()

  if (typeof window !== 'undefined') {
    const webAppUser = (window as unknown as Window).Telegram.WebAppUser
    console.log('webAppUser', JSON.stringify(webAppUser))
    if (!telegramUser && webAppUser) {
      setTelegramUser(webAppUser)
      onUserDetected(webAppUser.id)
    }
  }

  if (!telegramUser) {
    return <div>You opened this page outside Telegram!!!</div>
  }

  return (
    <>
      <pre>{JSON.stringify(telegramUser)}</pre>
    </>
  )
}
