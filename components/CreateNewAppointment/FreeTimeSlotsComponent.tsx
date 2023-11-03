import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { LinkModel } from '@/lib/models/Link.model'
import { TimeSlot } from '@/lib/models/Appointment.model'
import { GetFreeTimeSlotsPayload } from '@/app/api/timeSlots/route'
import { getFreeTimeSlotsForRange } from '@/lib/services/timeSlots.service'
import queryString from 'query-string'

interface FreeTimeSlotsComponentProps {
  link: LinkModel
  dateString: string
  timezone: string
  onTimeSlotSelected: (timeSlot: TimeSlot) => void
}

export function FreeTimeSlotsComponent({
  link,
  dateString,
  timezone,
  onTimeSlotSelected,
}: FreeTimeSlotsComponentProps) {
  function getQueryKey() {
    return `link-${link.id}-slots-${dateString}-${timezone}`
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [getQueryKey()],
    queryFn: async () => {
      const requestData: GetFreeTimeSlotsPayload = {
        linkId: link.id,
        date: dateString,
        requesterTimezone: timezone,
      }
      const response = await fetch(
        `/api/timeSlots?${queryString.stringify(requestData as any)}`
      )

      if (!response.ok) {
        throw new Error('Failed to get free time slots')
      }

      const { timeSlots } = await response.json()
      return timeSlots as ReturnType<typeof getFreeTimeSlotsForRange>
    },
    staleTime: 0,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !data) {
    return <div>Error occurred while fetching data. {error?.message}</div>
  }

  return (
    <div className="grid grid-flow-row auto-rows-max">
      {data.map((timeSlot) => (
        <div
          key={timeSlot.startTime}
          className="flex flex-row"
          onClick={() => onTimeSlotSelected(timeSlot)}
        >
          {timeSlot.startTime} - {timeSlot.finishTime}
        </div>
      ))}
    </div>
  )
}
