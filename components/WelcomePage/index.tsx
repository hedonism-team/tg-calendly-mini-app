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
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content w-80 text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hi there! 🙂</h1>
          <div className="py-6">
            {!user && (
              <span className="loading loading-spinner text-accent"></span>
            )}
            {user && (
              <div>
                <h1 className="font-bold">
                  We are glad to welcome you
                  <kbd className="kbd kbd-md">{getUserNickname(user)}</kbd>
                </h1>
              </div>
            )}
            <div className="mt-4">
              <p>Create your personal link to start getting booking requests</p>
            </div>
          </div>
          <a href={getCreateNewLinkPageUrl()}>
            <button className="btn btn-primary">Create a link</button>
          </a>
        </div>
      </div>
    </div>
  )
}

function getCreateNewLinkPageUrl() {
  return 'https://t.me/meetly_bot/app?startapp=new'
}
