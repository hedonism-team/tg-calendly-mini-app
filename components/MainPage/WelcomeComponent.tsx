'use client'
import React from 'react'

interface WelcomeComponentProps {
  userId: number | undefined
}
export function WelcomeComponent({ userId }: WelcomeComponentProps) {
  if (!userId) {
    return <div>Welcome: userId is not defined</div>
  }
  return <div>Welcome to Meetly</div>
}
