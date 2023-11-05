import React from 'react'

export function AppointmentCreationSuccess() {
  return (
    <div className="flex w-full min-h-screen">
      <div className="w-80 h-fit mx-auto mt-52 text-center">
        <h1 className="font-bold">🎉 Success!</h1>
        <h2>
          Your appointment request has been successfully sent. You get a
          notification via bot once the request is resolved.
        </h2>
      </div>
    </div>
  )
}
