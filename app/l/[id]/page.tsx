import React from 'react'
import { CreateNewAppointmentComponent } from '@/components/CreateNewAppointment'
import { getLinkById } from '@/lib/services/links.service'

export default async function CreateNewAppointmentPage({
  params,
}: {
  params: { id: string }
}) {
  const link = await getLinkById(params.id)
  return (
    <div>
      <p>ENV: {process.env.NODE_ENV}</p>
      <p>Link id: {params.id}</p>
      <CreateNewAppointmentComponent link={link} />
    </div>
  )
}
