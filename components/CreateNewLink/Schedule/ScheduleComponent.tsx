import React, { useState } from 'react'
import { cloneDeep } from 'lodash'

import {
  DayOfWeek,
  ScheduleModel,
  WorkingHoursRange,
} from '@/lib/models/Schedule.model'
import { TelegramMainButton } from '@/components/TelegramMainButton'
import { TelegramBackButton } from '@/components/TelegramBackButton'
import { getWeekdayNames } from '@/lib/utils/weekdays'
import { WeekdayWorkingHoursComponent } from '@/components/CreateNewLink/Schedule/WeekdayWorkingHoursComponent'

interface ScheduleComponentProps {
  onScheduleSelected: (schedule: ScheduleModel) => void
  onBackButtonClicked: () => void
}

const weekdayNames = getWeekdayNames()
const defaultDayStartTime = '09:00'
const defaultDayFinishTime = '18:00'

export function ScheduleComponent({
  onScheduleSelected,
  onBackButtonClicked,
}: ScheduleComponentProps) {
  const [schedule, setSchedule] = useState<ScheduleModel>(getDefaultSchedule())
  return (
    <div className="flex w-full justify-center">
      <div className="w-80">
        <div className="flex flex-col justify-center">
          {weekdayNames.map((weekdayName, dayOfWeek) => (
            <WeekdayWorkingHoursComponent
              key={weekdayName}
              weekdayName={weekdayName}
              selectedWorkingHours={getSelectedWorkingHours(
                schedule,
                dayOfWeek
              )}
              onWorkingHoursSelected={(value) => {
                const updatedSchedule = getUpdatedSchedule(
                  schedule,
                  dayOfWeek,
                  value
                )
                console.log('updatedSchedule', updatedSchedule)
                setSchedule(updatedSchedule)
              }}
            />
          ))}
        </div>
      </div>
      <TelegramBackButton
        onClick={() => {
          setSchedule(getDefaultSchedule)
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

function getDefaultSchedule() {
  const result: Partial<ScheduleModel> = {}
  for (let i = DayOfWeek.Monday; i <= DayOfWeek.Friday; i++) {
    result[i] = {
      startTime: defaultDayStartTime,
      finishTime: defaultDayFinishTime,
    }
  }
  result[DayOfWeek.Saturday] = null
  result[DayOfWeek.Sunday] = null
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
    if (!result[weekday]) {
      // @ts-ignore
      result[weekday] = {}
    }
    if (workingHours.startTime) {
      result[weekday]!.startTime = workingHours.startTime
    }
    if (workingHours.finishTime) {
      result[weekday]!.finishTime = workingHours.finishTime
    }
  }
  return result
}

function getSelectedWorkingHours(schedule: ScheduleModel, weekday: DayOfWeek) {
  return schedule[weekday]
}
