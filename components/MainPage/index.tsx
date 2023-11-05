'use client'

import React, { useEffect, useState } from 'react'
import { WebAppUser } from '@twa-dev/types'

import { TelegramEnvGuard } from '@/components/TelegramEnvGuard'
import { CreateNewAppointmentComponent } from '@/components/CreateNewAppointment'
import { CreateNewLinkComponent } from '@/components/CreateNewLink'
import { ConfirmTimezoneComponent } from '@/components/MainPage/ConfirmTimezoneComponent'
import { WelcomeComponent } from '@/components/WelcomePage'
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
  function getDefaultTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  const [isClientSide, setIsClientSide] = useState(false)
  const [user, setUser] = useState<WebAppUser | undefined>()
  const [startParam, setStartParam] = useState<string | undefined>()
  const [timezone, setTimezone] = React.useState<string | undefined>()
  const [isTimezoneConfirmed, setIsTimezoneConfirmed] = useState<boolean>(false)

  // TODO remove
  if (!isProduction) {
    if (defaultUserId && !user) {
      console.log('default userId', defaultUserId)
      setUser({ id: defaultUserId } as WebAppUser)
    }
    if (defaultStartParam && !startParam) {
      console.log('default startParam', defaultStartParam)
      setStartParam(defaultStartParam)
    }
    if (!isTimezoneConfirmed) {
      setIsTimezoneConfirmed(true)
    }
  }

  useEffect(() => {
    setIsClientSide(true)
    setTimezone(getDefaultTimezone())
  }, [])

  useEnsureUser(user, isClientSide)

  return (
    <div className="flex min-h-screen flex-col">
      {isClientSide && (
        <>
          {isProduction && (
            <TelegramEnvGuard
              onUserDetected={setUser}
              onStartParamDetected={setStartParam}
            />
          )}
          {user && isWelcomeMode(startParam) && (
            <WelcomeComponent tgUser={user} />
          )}
          {user && !isTimezoneConfirmed && !isWelcomeMode(startParam) && (
            <ConfirmTimezoneComponent
              timezone={timezone!}
              onTimezoneChanged={setTimezone}
              onTimezoneConfirmed={() => setIsTimezoneConfirmed(true)}
            />
          )}
          {user && isTimezoneConfirmed && isCreateNewLinkMode(startParam) && (
            <CreateNewLinkComponent
              userId={user.id}
              timezone={timezone!}
              onBackButtonClicked={() => setIsTimezoneConfirmed(false)}
            />
          )}
          {user &&
            isTimezoneConfirmed &&
            isCreateNewAppointmentMode(startParam) && (
              <CreateNewAppointmentComponent
                userId={user.id}
                linkId={parseLinkId(startParam!)}
                timezone={timezone!}
                onBackButtonClicked={() => setIsTimezoneConfirmed(false)}
              />
            )}
        </>
      )}
    </div>
  )
}

// private

function isWelcomeMode(startParam: string | undefined) {
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

function useEnsureUser(user: WebAppUser | undefined, isClientSide: boolean) {
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

    if (user && isClientSide) {
      createUser(user).then(() => {})
    }
  }, [user, isClientSide])
}
