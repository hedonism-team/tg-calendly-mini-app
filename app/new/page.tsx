import { CreateNewLinkComponent } from '@/components/CreateNewLink'
import React from 'react'

export default async function CreateNewLinkPage() {
  return (
    <div>
      <p>ENV: {process.env.NODE_ENV}</p>
      <CreateNewLinkComponent userId={undefined} env={process.env.NODE_ENV} />
    </div>
  )
}
