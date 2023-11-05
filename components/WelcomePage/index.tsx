import React, { useCallback, useEffect, useState } from 'react'
import { WebAppUser } from '@twa-dev/types'
import { UserModel } from '@/lib/models/User.model'
import { getUserNickname } from '@/lib/services/users.service'

interface WelcomeComponentProps {
  tgUser: WebAppUser
}
export function WelcomeComponent({ tgUser }: WelcomeComponentProps) {
  const [user, setUser] = useState<UserModel | undefined | null>()

  const wrappedSetUser = useCallback((user: UserModel | null) => {
    setUser(user)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/users?id=${tgUser.id}`)
      if (!response.ok) {
        throw new Error('Failed to get user')
      }
      return response.json()
    }

    getUser()
      .then((data) => {
        wrappedSetUser(data.user)
      })
      .catch((e) => {
        wrappedSetUser(null)
      })
  }, [tgUser.id, wrappedSetUser])

  return (
    <>
      <div>Welcome to Meetly</div>
      {user && <div>We are glad to welcome you ${getUserNickname(user)}</div>}
    </>
  )
}
