import React from 'react'
import { getLinkById } from '@/lib/services/links.service'

// TODO remove
export default async function CreateNewAppointmentPage({
  params,
}: {
  params: { id: string }
}) {
  const link = await getLinkById(params.id, { includeSchedule: true })
  if (!link) {
    return <div>Link does not exist</div>
  }
  return (
    <div>
      <p>ENV: {process.env.NODE_ENV}</p>
      <p>Link id: {params.id}</p>
    </div>
  )
}
