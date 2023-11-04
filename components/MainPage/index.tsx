'use client'

import { useEffect, useState } from 'react'
import { WebAppUser } from '@twa-dev/types'

import { TelegramEnvGuard } from '@/components/TelegramEnvGuard'
import { CreateNewAppointmentComponent } from '@/components/CreateNewAppointment'
import { CreateNewLinkComponent } from '@/components/CreateNewLink'
import { WelcomeComponent } from '@/components/MainPage/WelcomeComponent'

interface MainPageComponentProps {
  isProduction: boolean
  defaultUserId: number | undefined
  defaultStartParam: string | undefined
}

export function MainPageComponent({
  isProduction,
  defaultUserId,
  defaultStartParam,
}: MainPageComponentProps) {
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<WebAppUser | undefined>()
  const [startParam, setStartParam] = useState<string | undefined>()

  if (!isProduction) {
    if (defaultUserId && !user) {
      console.log('default userId', defaultUserId)
      setUser({ id: defaultUserId } as WebAppUser)
    }
    if (defaultStartParam && !startParam) {
      console.log('default startParam', defaultStartParam)
      setStartParam(defaultStartParam)
    }
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  console.log('start_param111', startParam)

  return (
    <>
      {isClient && (
        <>
          {isProduction && (
            <TelegramEnvGuard
              onUserDetected={setUser}
              onStartParamDetected={setStartParam}
            />
          )}
          {user && isDefaultMode(startParam) && (
            <WelcomeComponent userId={user.id} />
          )}
          {user && isCreateNewLinkMode(startParam) && (
            <CreateNewLinkComponent userId={user.id} />
          )}
          {user && isCreateNewAppointmentMode(startParam) && (
            <CreateNewAppointmentComponent
              userId={user.id}
              linkId={parseLinkId(startParam!)}
            />
          )}
        </>
      )}
    </>
  )
}

function isDefaultMode(startParam: string | undefined) {
  return startParam === ''
}

function isCreateNewLinkMode(startParam: string | undefined) {
  return startParam === 'new'
}

function isCreateNewAppointmentMode(startParam: string | undefined) {
  return startParam && startParam.startsWith('l_')
}

function parseLinkId(startParam: string) {
  return startParam.slice(2)
}
