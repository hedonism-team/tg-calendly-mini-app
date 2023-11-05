'use client'

import { useEffect, useState } from 'react'
import { WebAppUser } from '@twa-dev/types'

import { TelegramEnvGuard } from '@/components/TelegramEnvGuard'
import { CreateNewAppointmentComponent } from '@/components/CreateNewAppointment'
import { CreateNewLinkComponent } from '@/components/CreateNewLink'
import { WelcomeComponent } from '@/components/MainPage/WelcomeComponent'
import { CreateNewUserPayload } from '@/app/api/users/route'

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

  useCreateUser(user, isClient)

  return (
    <div className="flex min-h-screen flex-col">
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
    </div>
  )
}

// private

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

function useCreateUser(user: WebAppUser | undefined, isClient: boolean) {
  useEffect(() => {
    const createUser = async (user: WebAppUser) => {
      const requestData: CreateNewUserPayload = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
      }
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      return response.json()
    }

    if (user && isClient) {
      createUser(user).then(() => {})
    }
  }, [user, isClient])
}
