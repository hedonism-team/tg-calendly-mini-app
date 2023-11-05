import { NextRequest, NextResponse } from 'next/server'

import { LinkModel } from '@/lib/models/Link.model'
import { createNewLink } from '@/lib/services/links.service'
import { ScheduleModel } from '@/lib/models/Schedule.model'

export interface CreateNewLinkPayload {
  link: Omit<LinkModel, 'schedule' | 'id'>
  schedule: ScheduleModel
}

export async function POST(request: NextRequest) {
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
