import { NextRequest, NextResponse } from 'next/server'
import { Schedule } from '@prisma/client'

import { LinkModel } from '@/lib/models/Link.model'
import { createNewLink } from '@/lib/services/links.service'

export interface CreateNewLinkPayload {
  link: Omit<LinkModel, 'schedule'>
  schedule: Schedule
}

export async function POST(request: NextRequest) {
  // TODO validate data as CreateNewLinkPayload
  const data = await request.json()
  try {
    const link = await createNewLink(data.link, data.schedule)
    return NextResponse.json({ link }, { status: 201 })
  } catch (e) {
    const error = e as Error
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}
