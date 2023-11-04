import React from 'react'
import { Telegram, WebAppUser } from '@twa-dev/types'

interface TelegramUserIdProps {
  onUserDetected: (userId: number) => void
  onStartParamDetected: (param: string) => void
}

interface Window {
  Telegram: Telegram
}

export function TelegramEnvGuard({
  onUserDetected,
  onStartParamDetected,
}: TelegramUserIdProps) {
  const [telegramUser, setTelegramUser] = React.useState<
    WebAppUser | undefined
  >()

  if (typeof window === 'undefined') {
    return <div>Getting Telegram user info...</div>
  }

  const { initDataUnsafe } = (window as unknown as Window).Telegram.WebApp
  const { user, start_param } = initDataUnsafe
  console.log('user', user)
  console.log('start_param', start_param)
  if (!telegramUser && user) {
    setTelegramUser(user)
    onUserDetected(user.id)
    onStartParamDetected(start_param ?? '')
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
