import React from 'react'
import { UserModel } from '@/lib/models/User.model'
import { getUserNickname } from '@/lib/services/users.service'

interface CreateAppointmentPageHeaderProps {
  linkOwner: UserModel
}

export function CreateAppointmentPageHeader({
  linkOwner,
}: CreateAppointmentPageHeaderProps) {
  return (
    <div className="flex mt-5">
      <div className="flex flex-col mx-auto w-80">
        <div className="flex-1 w-full text-center overflow-x-auto">
          <h1 className="font-bold text-xl text-accent">
            <kbd className="kbd kbd-sm">{getUserNickname(linkOwner)}</kbd>
            &apos;s time booking
          </h1>
        </div>
        <div className="flex-1 w-full mt-5 text-center">
          <h2 className="font-bold">Choose suitable date and time slot</h2>
        </div>
      </div>
    </div>
  )
}
