'use client'

import { TelegramEnvGuard } from '@/components/TelegramEnvGuard'
import { useEffect, useState } from 'react'
import { CreateNewAppointmentComponent } from '@/components/CreateNewAppointment'
import { CreateNewLinkComponent } from '@/components/CreateNewLink'

export function MainPageComponent() {
  const [isClient, setIsClient] = useState(false)
  const [userId, setUserId] = useState<number | undefined>()
  const [startParam, setStartParam] = useState<string | undefined>()

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {isClient && (
        <>
          <TelegramEnvGuard
            onUserDetected={setUserId}
            onStartParamDetected={setStartParam}
          />
          {userId && startParam === '' && <div>Welcome to Meetly</div>}
          {userId && startParam === 'new' && (
            <CreateNewLinkComponent userId={userId} />
          )}
          {userId && startParam && startParam.startsWith('l_') && (
            <CreateNewAppointmentComponent
              linkId={startParam.slice(2)}
              userId={userId}
            />
          )}
        </>
      )}
    </>
  )
}
