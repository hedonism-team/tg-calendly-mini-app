import { NextRequest, NextResponse } from 'next/server'
import queryString from 'query-string'

import { getFreeTimeSlotsForRange } from '@/lib/services/timeSlots.service'
import { getLinkById } from '@/lib/services/links.service'

export interface GetFreeTimeSlotsPayload {
  linkId: string
  date: string
  requesterTimezone: string
}

export async function GET(request: NextRequest) {
  try {
    const data = parseRequestData(request.url)
    const link = await getLinkById(data.linkId, { includeSchedule: true })
    if (!link) {
      throw new Error('Link with such linkId does not exist')
    }
    const timeSlots = await getFreeTimeSlotsForRange(
      link,
      data.date,
      data.requesterTimezone
    )
    return NextResponse.json({ timeSlots })
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
  // TODO validate data as GetFreeTimeSlotsPayload
  if (data.linkId && data.date && data.requesterTimezone) {
    return {
      linkId: data.linkId,
      date: data.date,
      requesterTimezone: data.requesterTimezone,
    } as GetFreeTimeSlotsPayload
  }
  throw Error('Invalid input params')
}
