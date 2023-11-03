import { NextRequest, NextResponse } from 'next/server'
import { createNewAppointment } from '@/lib/services/appointments.service'

export async function POST(request: NextRequest) {
  // TODO validate data as CreateNewAppointmentPayload
  const data = await request.json()
  await createNewAppointment(data)
  return NextResponse.json({ data })
}
