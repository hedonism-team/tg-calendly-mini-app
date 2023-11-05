import React from 'react'
import { range } from 'lodash'
import { WorkingHoursRange } from '@/lib/models/Schedule.model'

interface WeekdayWorkingHoursComponentProps {
  weekdayName: string
  selectedWorkingHours: Partial<WorkingHoursRange> | null
  onWorkingHoursSelected: (value: Partial<WorkingHoursRange> | null) => void
}

enum TimePointType {
  start = 'start',
  finish = 'finish',
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
  return (
    <>
      {timePointTypes.map((timePointType) => (
        <div key={weekdayName + timePointType} className="">
          <div className="form-control max-w-xs">
            <label className="label">
              <span className="label-text">
                {weekdayName} {timePointType} time
              </span>
            </label>
            <select
              className="select select-sm select-bordered max-w-xs"
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
    </>
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
  if (timePointType === 'start') {
    return timePointToString(timePoint) === selectedWorkingHours.startTime
  }
  return timePointToString(timePoint) === selectedWorkingHours.finishTime
}
