import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { LinkModel } from '@/lib/models/Link.model'
import { getFreeTimeSlotsForRange } from '@/lib/services/timeSlots.service'
import { TimeSlot } from '@/lib/models/Appointment.model'

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

  const { data, isLoading, isError } = useQuery({
    queryKey: [getQueryKey()],
    queryFn: async () => {
      return await getFreeTimeSlotsForRange(link, dateString, timezone)
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !data) {
    return <div>Error occurred while fetching data.</div>
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
