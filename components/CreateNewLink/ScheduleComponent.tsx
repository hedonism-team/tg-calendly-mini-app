import React, { useState } from 'react'
import {
  DayOfWeek,
  ScheduleModel,
  WorkingHoursRange,
} from '@/lib/models/Schedule.model'
import { TelegramMainButton } from '@/components/TelegramMainButton'
import { TelegramBackButton } from '@/components/TelegramBackButton'
import { getWeekdayNames } from '@/lib/utils/weekdays'
import { cloneDeep, range } from 'lodash'

interface ScheduleComponentProps {
  onScheduleSelected: (schedule: ScheduleModel) => void
  onBackButtonClicked: () => void
}

enum TimePointType {
  start = 'start',
  finish = 'finish',
}

const weekdayNames = getWeekdayNames()
const timePointTypes = [TimePointType.start, TimePointType.finish]
const defaultDayStartTime = '09:00'
const defaultDayFinishTime = '18:00'
const allTimePoints: { hours: number; minutes: number }[] = []
for (const hours of range(0, 24)) {
  for (const minutes of range(0, 60, 15)) {
    allTimePoints.push({ hours, minutes })
  }
}

export function ScheduleComponent({
  onScheduleSelected,
  onBackButtonClicked,
}: ScheduleComponentProps) {
  const [schedule, setSchedule] = useState<ScheduleModel>(getEmptySchedule())
  return (
    <div className="flex w-full justify-center">
      <div className="w-80">
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 justify-center">
          {weekdayNames.map((weekdayName, weekdayIndex) =>
            timePointTypes.map((timePointType) => (
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
                      const updatedSchedule = getUpdatedSchedule(
                        schedule,
                        weekdayIndex,
                        timePointType === TimePointType.start
                          ? { startTime: value }
                          : { finishTime: value }
                      )
                      setSchedule(updatedSchedule)
                    }}
                  >
                    {allTimePoints.map((timePoint) => (
                      <option
                        key={timePointToString(timePoint)}
                        selected={isSelectedTimePoint(timePointType, timePoint)}
                      >
                        {timePointToString(timePoint)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <TelegramBackButton
        onClick={() => {
          setSchedule(getEmptySchedule)
          onBackButtonClicked()
        }}
      />
      <TelegramMainButton
        disabled={!schedule}
        text={'Proceed with this schedule'}
        onClick={() => onScheduleSelected(schedule)}
      />
    </div>
  )
}

// private

function getEmptySchedule() {
  const result: Partial<ScheduleModel> = {}
  for (let i = DayOfWeek.Monday; i <= DayOfWeek.Sunday; i++) {
    result[i] = null
  }
  return result as ScheduleModel
}

function getUpdatedSchedule(
  schedule: ScheduleModel,
  weekday: DayOfWeek,
  workingHours: Partial<WorkingHoursRange> | null
) {
  const result = cloneDeep(schedule)
  if (!workingHours) {
    result[weekday] = null
  } else {
    if (workingHours.startTime) {
      result[weekday]!.startTime = workingHours.startTime
    }
    if (workingHours.finishTime) {
      result[weekday]!.finishTime = workingHours.finishTime
    }
  }
  return result
}

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
  type: string,
  timePoint: { hours: number; minutes: number }
) {
  return (
    (type === 'start' &&
      timePointToString(timePoint) === defaultDayStartTime) ||
    (type === 'finish' && timePointToString(timePoint) === defaultDayFinishTime)
  )
}
