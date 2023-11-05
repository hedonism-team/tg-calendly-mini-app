import React from 'react'

interface ErrorPageProps {
  message: string
}

export function ErrorPage({ message }: ErrorPageProps) {
  return (
    <div className="flex w-full min-h-screen">
      <div className="w-80 h-fit mx-auto mt-52 text-center">
        <h1 className="font-bold text-error">⛔ Error!</h1>
        <h2 className="text-error">{message}</h2>
      </div>
    </div>
  )
}
