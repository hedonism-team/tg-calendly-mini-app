import { getFreeTimeSlotsForRange } from '@/lib/services/timeSlots.service'
import { fakeLink } from '@/tests/fakers/links.faker'
import dayjs from 'dayjs'

export default async function CreateNewAppointmentPage({
  params,
}: {
  params: { id: string }
}) {
  const link = fakeLink()
  const dateString = dayjs().format('YYYY-MM-DD')
  const timezone = 'Asia/Srednekolymsk'
  const timeSlots = await getFreeTimeSlotsForRange(link, dateString, timezone)
  return (
    <div>
      <p>Link id: {params.id}</p>
      <br />
      <p>Date: {dateString}</p>
      <br />
      <ul>
        {timeSlots.map((timeSlot) => (
          <li key={timeSlot.startTime}>
            {timeSlot.startTime} - {timeSlot.finishTime}
          </li>
        ))}
      </ul>
    </div>
  )
}
