import { NextRequest, NextResponse } from 'next/server'
import { createNewAppointment } from '@/lib/services/appointments.service'

export async function POST(request: NextRequest) {
  // TODO validate data as CreateNewAppointmentPayload
  const data = await request.json()
  try {
    const appointment = await createNewAppointment(data)
    return NextResponse.json({ appointment }, { status: 201 })
  } catch (e) {
    const error = e as Error
    return NextResponse.json(
      { error: { message: error.message } },
      { status: 500 }
    )
  }
}
