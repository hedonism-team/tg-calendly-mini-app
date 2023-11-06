import queryString from 'query-string'
import { NextRequest, NextResponse } from 'next/server'
import { createOrUpdateUser, getUserById } from '@/lib/services/users.service'

export interface GetUserByIdPayload {
  id: number
}

export async function GET(request: NextRequest) {
  const { id } = parseRequestData(request.url)
  try {
    const user = await getUserById(id)
    return NextResponse.json({ user }, { status: user ? 200 : 404 })
  } catch (e) {
    const error = e as Error
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}

export interface CreateNewUserPayload {
  id: number
  firstName?: string
  lastName?: string
  username?: string
}

export async function POST(request: NextRequest) {
  const data = await request.json()
  try {
    const user = await createOrUpdateUser(data)
    return NextResponse.json({ user })
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
    return { id: Number(data.id) } as GetUserByIdPayload
  }
  throw Error('Invalid input params')
}
