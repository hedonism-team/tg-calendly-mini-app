import { useState } from 'react'
import { Telegram, WebAppUser } from '@twa-dev/types'

interface TelegramUserIdProps {
  onUserDetected: (user: WebAppUser) => void
  onStartParamDetected: (param: string) => void
}

interface Window {
  Telegram: Telegram
}

export function TelegramEnvGuard({
  onUserDetected,
  onStartParamDetected,
}: TelegramUserIdProps) {
  const [telegramUser, setTelegramUser] = useState<WebAppUser | undefined>()

  const { initDataUnsafe } = (window as unknown as Window).Telegram.WebApp
  const { user: webAppUser, start_param } = initDataUnsafe
  if (!telegramUser && webAppUser) {
    setTelegramUser(webAppUser)
    onUserDetected(webAppUser)
    onStartParamDetected(start_param ?? '')
  }

  if (!telegramUser) {
    return <div>You opened this page outside Telegram!!!</div>
  }
}
