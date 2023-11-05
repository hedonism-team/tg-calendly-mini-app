import { NextRequest, NextResponse } from 'next/server'

import { LinkModel } from '@/lib/models/Link.model'
import { createOrUpdateLink } from '@/lib/services/links.service'
import { ScheduleModel } from '@/lib/models/Schedule.model'
import { sendLinkCreatedNotification } from '@/lib/services/notifications.service'

export interface CreateNewLinkPayload {
  link: Omit<LinkModel, 'schedule' | 'id'>
  schedule: ScheduleModel
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  try {
    const { link, isNew } = await createOrUpdateLink(data.link, data.schedule)
    await sendLinkCreatedNotification(link)
    return NextResponse.json({ link }, { status: isNew ? 201 : 200 })
  } catch (e) {
    const error = e as Error
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}
