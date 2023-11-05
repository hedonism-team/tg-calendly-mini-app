import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import queryString from 'query-string'
import { GetFreeTimeSlotsPayload } from '@/app/api/timeSlots/route'
import { getFreeTimeSlotsForRange } from '@/lib/services/timeSlots.service'
import { ShiftedTimeSlot } from '@/lib/models/Appointment.model'

interface FreeTimeSlotsComponentProps {
  linkId: string
  dateString: string
  timezone: string
  onTimeSlotSelected: (timeSlot: ShiftedTimeSlot | undefined) => void
}

export function FreeTimeSlotsComponent({
  linkId,
  dateString,
  timezone,
  onTimeSlotSelected,
}: FreeTimeSlotsComponentProps) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    ShiftedTimeSlot | undefined
  >()

  useEffect(() => {
    setSelectedTimeSlot(undefined)
  }, [dateString])

  function getQueryKey() {
    return `link-${linkId}-slots-${dateString}-${timezone}`
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [getQueryKey()],
    queryFn: async () => {
      const requestData: GetFreeTimeSlotsPayload = {
        linkId,
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
    return (
      <div className="flex w-full justify-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex w-full justify-center">
        <div className="text-error">
          <span>Error occurred while fetching data. {error?.message}</span>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex w-full justify-center">
        <div className="text-error">
          <span>No time slots available</span>
        </div>
      </div>
    )
  }

  return (
    // max-h-56 overflow-y-scroll
    <div className="flex w-full justify-center">
      <div className="flex flex-wrap w-80">
        {data.map((timeSlot) => (
          <div key={timeSlot.startTime} className="flex m-2 justify-center">
            <div
              className={
                'btn w-36 ' +
                (areTimeSlotsEqual(timeSlot, selectedTimeSlot!)
                  ? 'btn-primary'
                  : 'btn-outline btn-secondary')
              }
              onClick={() => {
                setSelectedTimeSlot(timeSlot)
                onTimeSlotSelected(timeSlot)
              }}
            >
              {timeSlot.startTime} - {timeSlot.finishTime}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// helpers

function areTimeSlotsEqual(
  firstTimeSlot: ShiftedTimeSlot,
  secondTimeSlot: ShiftedTimeSlot | undefined
) {
  return (
    secondTimeSlot &&
    firstTimeSlot.startTime === secondTimeSlot.startTime &&
    firstTimeSlot.finishTime === secondTimeSlot.finishTime
  )
}
