import { NextRequest, NextResponse } from 'next/server'
import queryString from 'query-string'

import { LinkModel } from '@/lib/models/Link.model'
import { createOrUpdateLink, getLinkById } from '@/lib/services/links.service'
import { ScheduleModel } from '@/lib/models/Schedule.model'
import {
  sendLinkCreatedNotification,
  sendLinkUpdatedNotification,
} from '@/lib/services/notifications.service'
import { getUserById } from '@/lib/services/users.service'

export interface CreateNewLinkPayload {
  link: Omit<LinkModel, 'schedule' | 'id'>
  schedule: ScheduleModel
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  try {
    const { link, isNew } = await createOrUpdateLink(data.link, data.schedule)
    if (isNew) {
      await sendLinkCreatedNotification(link)
    } else {
      await sendLinkUpdatedNotification(link)
    }
    return NextResponse.json({ link }, { status: isNew ? 201 : 200 })
  } catch (e) {
    const error = e as Error
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}

export interface GetLinkByIdPayload {
  id: string
}

export async function GET(request: NextRequest) {
  const { id } = parseRequestData(request.url)
  try {
    const link = await getLinkById(id)
    const owner = link ? await getUserById(link.userId) : null
    return NextResponse.json({ link, owner }, { status: link ? 200 : 404 })
  } catch (e) {
    const error = e as Error
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}

// private

function parseRequestData(requestUrl: string) {
  const { query: data } = queryString.parseUrl(requestUrl)
  if (data.id) {
    return { id: String(data.id) } as GetLinkByIdPayload
  }
  throw Error('Invalid input params')
}
