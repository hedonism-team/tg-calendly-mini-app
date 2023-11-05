import { useState } from 'react'
import { Telegram, WebAppUser } from '@twa-dev/types'
import { ErrorPage } from '@/components/ErrorPage'

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
    console.log('webAppUser', webAppUser)
    console.log('start_param', start_param)
    onUserDetected(webAppUser)
    onStartParamDetected(start_param ?? '')
  }

  if (!telegramUser) {
    return <ErrorPage message={'You opened this page outside Telegram!'} />
  }
}
