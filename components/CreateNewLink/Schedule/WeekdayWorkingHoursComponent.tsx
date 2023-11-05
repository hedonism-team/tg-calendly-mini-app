import React, { useState } from 'react'
import { range } from 'lodash'
import { WorkingHoursRange } from '@/lib/models/Schedule.model'

interface WeekdayWorkingHoursComponentProps {
  weekdayName: string
  selectedWorkingHours: Partial<WorkingHoursRange> | null
  onWorkingHoursSelected: (value: Partial<WorkingHoursRange> | null) => void
}

enum TimePointType {
  start = 'Start',
  finish = 'Finish',
}

interface TimePoint {
  hours: number
  minutes: number
}

const timePointTypes = [TimePointType.start, TimePointType.finish]

const allTimePoints: TimePoint[] = []
for (const hours of range(0, 24)) {
  for (const minutes of range(0, 60, 15)) {
    allTimePoints.push({ hours, minutes })
  }
}

export function WeekdayWorkingHoursComponent({
  weekdayName,
  selectedWorkingHours,
  onWorkingHoursSelected,
}: WeekdayWorkingHoursComponentProps) {
  const [isNonWorkingDay, setIsNonWorkingDay] = useState<boolean>(
    selectedWorkingHours === null
  )

  return (
    <div className="flex flex-row">
      <div className="w-1/3 flex justify-end">
        <div className="flex flex-row mx-2 items-end">
          <div className="mx-2">
            <input
              type="checkbox"
              checked={!isNonWorkingDay}
              onChange={(e) => {
                const value = e.target.checked
                if (!value) {
                  setIsNonWorkingDay(true)
                  onWorkingHoursSelected(null)
                } else {
                  setIsNonWorkingDay(false)
                }
              }}
              className="checkbox checkbox-sm"
            />
          </div>
          <div className="w-12 mb-1">
            <span>{weekdayName.slice(0, 3)}</span>
          </div>
        </div>
      </div>
      {timePointTypes.map((timePointType) => (
        <div key={timePointType} className="w-1/3 flex flex-row">
          <div className="form-control max-w-xs">
            <label className="label py-1">
              <span className="label-text">
                {timePointType === TimePointType.start ? 'From' : 'To'}
              </span>
            </label>
            <select
              disabled={isNonWorkingDay}
              className="select select-xs select-bordered max-w-xs"
              onChange={(e) => {
                const value = e.target.value
                onWorkingHoursSelected(
                  timePointType === TimePointType.start
                    ? { startTime: value }
                    : { finishTime: value }
                )
              }}
            >
              {allTimePoints.map((timePoint) => (
                <option
                  key={timePointToString(timePoint)}
                  selected={isSelectedTimePoint(
                    selectedWorkingHours,
                    timePointType,
                    timePoint
                  )}
                >
                  {timePointToString(timePoint)}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}

// private

function timePointToString({
  hours,
  minutes,
}: {
  hours: number
  minutes: number
}) {
  return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`
}

function isSelectedTimePoint(
  selectedWorkingHours: Partial<WorkingHoursRange> | null,
  timePointType: TimePointType,
  timePoint: TimePoint
) {
  if (!selectedWorkingHours) {
    return false
  }
  if (timePointType === TimePointType.start) {
    return timePointToString(timePoint) === selectedWorkingHours.startTime
  }
  return timePointToString(timePoint) === selectedWorkingHours.finishTime
}
