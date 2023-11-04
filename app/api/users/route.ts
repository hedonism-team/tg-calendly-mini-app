import { NextRequest, NextResponse } from 'next/server'
import { createUserIfNotExists } from '@/lib/services/users.service'

export interface CreateNewUserPayload {
  id: number
  firstName?: string
  lastName?: string
  username?: string
}

export async function POST(request: NextRequest) {
  // TODO validate data as CreateNewUserPayload
  const data = await request.json()
  try {
    const user = await createUserIfNotExists(data)
    return NextResponse.json({ user })
  } catch (e) {
    const error = e as Error
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}
