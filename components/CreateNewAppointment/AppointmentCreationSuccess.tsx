import React from 'react'

export function AppointmentCreationSuccess() {
  return (
    <div className="flex w-full min-h-screen">
      <div className="w-80 h-fit m-auto text-center">
        <h1 className="font-bold">🎉 Success!</h1>
        <h2>
          Your appointment request has been successfully sent. I get a
          notification via bot once the request is resolved
        </h2>
      </div>
    </div>
  )
}
