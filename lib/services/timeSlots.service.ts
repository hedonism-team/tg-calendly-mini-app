import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'

import { LinkModel, TimeSlotDuration } from '@/lib/models/Link.model'
import { getAllUserAppointmentsForDate } from '@/lib/services/appointments.service'
import { DayOfWeek, ScheduleType } from '@/lib/models/Schedule.model'
import { AppointmentModel, TimeSlot } from '@/lib/models/Appointment.model'
import { doRangesIntersect, getWeekday } from '@/lib/utils/dates'

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isBetween)

export interface DateRange {
  start: dayjs.Dayjs
  finish: dayjs.Dayjs
}

/**
 *
 * @param link
 * @param dateString - YYYY-MM-dd string (date selected in DatePicker)
 * @param requesterTimezone
 */
export async function getFreeTimeSlotsForRange(
  link: LinkModel,
  dateString: string,
  requesterTimezone: string
) {
  console.log('dateString', dateString)
  const requestRange = {
    start: dayjs
      .tz(dateString, requesterTimezone)
      .startOf('day')
      .tz(requesterTimezone),
    finish: dayjs
      .tz(dateString, requesterTimezone)
      .startOf('day')
      .add(1, 'day')
      .tz(requesterTimezone),
  }
  const existingAppointments = await getAllUserAppointmentsForDate(
    link.userId,
    requestRange
  )
  const allTimeSlots = getAllTimeSlots(
    requestRange,
    link.duration,
    link.timezone,
    link.schedule
  )
  console.log('allTimeSlots', JSON.stringify(allTimeSlots, null, 2))
  const freeTimeSlots = getFreeTimeSlots(
    allTimeSlots,
    existingAppointments,
    link.timezone,
    requestRange,
    requesterTimezone
  )
  console.log('freeTimeSlots', JSON.stringify(freeTimeSlots, null, 2))
  return freeTimeSlots
}

// private

interface OneDayTimeSlots {
  dateString: string
  slots: TimeSlot[]
}

function getAllTimeSlots(
  { start }: DateRange,
  duration: TimeSlotDuration,
  timezone: string, // host timezone
  schedule?: ScheduleType
) {
  if (!schedule) {
    return []
  }
  const daysToCheck = [
    start.subtract(1, 'day').tz(timezone),
    start.tz(timezone),
    start.add(1, 'day').tz(timezone),
  ]
  const allTimeSlots: OneDayTimeSlots[] = []
  for (const date of daysToCheck) {
    const dayOfWeek: DayOfWeek = getWeekday(date)
    allTimeSlots.push({
      dateString: date.format('YYYY-MM-DD'),
      slots: getOneDaySlots(dayOfWeek, duration, schedule),
    })
  }
  return allTimeSlots
}

function getOneDaySlots(
  dayOfWeek: DayOfWeek,
  duration: TimeSlotDuration,
  schedule: ScheduleType
) {
  const dayTimeSlots: TimeSlot[] = []
  const workingHoursRange = schedule[dayOfWeek]
  if (!workingHoursRange) {
    return []
  }
  let currentTimeSlotStartTime = workingHoursRange.startTime
  while (currentTimeSlotStartTime < workingHoursRange.finishTime) {
    const currentTimeSlotFinishTime = getTimeSlotFinishTime(
      currentTimeSlotStartTime,
      duration
    )
    if (currentTimeSlotFinishTime <= workingHoursRange.finishTime) {
      dayTimeSlots.push({
        startTime: currentTimeSlotStartTime,
        finishTime: currentTimeSlotFinishTime,
      })
    }
    currentTimeSlotStartTime = currentTimeSlotFinishTime
  }
  return dayTimeSlots
}

function parseTimeSlot(time: string) {
  const hours = Number(time.split(':')[0])
  const minutes = Number(time.split(':')[1])
  return { hours, minutes }
}

function getTimeSlotFinishTime(startTime: string, duration: TimeSlotDuration) {
  const { hours, minutes } = parseTimeSlot(startTime)
  const newMinutes = (minutes + duration.minutes) % 60
  const newHours =
    hours + duration.hours + Math.trunc((minutes + duration.minutes) / 60)
  return `${newHours < 10 ? '0' : ''}${newHours}:${
    newMinutes < 10 ? '0' : ''
  }${newMinutes}`
}

function getFreeTimeSlots(
  allTimeSlots: OneDayTimeSlots[],
  appointments: AppointmentModel[],
  timezone: string, // host timezone
  { start: startOfDay, finish: endOfDay }: DateRange, // request date range
  requesterTimezone: string
) {
  console.log('appointments', appointments)
  const appointmentsRanges = appointments.map(({ date, timeSlot }) =>
    timeSlotToDateRange(date, timeSlot, timezone)
  )
  console.log('appointmentsRanges', appointmentsRanges)
  console.log('request', {
    start: startOfDay.tz(requesterTimezone).format('YYYY-MM-DDTHH:mm:ssZ'),
    finish: endOfDay.tz(requesterTimezone).format('YYYY-MM-DDTHH:mm:ssZ'),
  })
  return allTimeSlots.flatMap(({ dateString, slots }) => {
    return slots
      .filter((timeSlot) => {
        const slotRange = timeSlotToDateRange(dateString, timeSlot, timezone)

        const slotStartInRequestedRange = slotRange.start
          .tz(requesterTimezone)
          .isBetween(startOfDay, endOfDay, 'minutes', '[)')
        const slotFinishInRequestedRange = slotRange.finish
          .tz(requesterTimezone)
          .isBetween(startOfDay, endOfDay, 'minutes', '(]')

        if (!slotStartInRequestedRange || !slotFinishInRequestedRange) {
          return false
        }

        return appointmentsRanges.every(
          (appointmentRange) => !doRangesIntersect(appointmentRange, slotRange)
        )
      })
      .map((slot) =>
        getShiftedTimeSlot(dateString, slot, timezone, requesterTimezone)
      )
  })
}

function timeSlotToDateRange(
  dateString: string,
  slot: TimeSlot,
  timezone: string
): DateRange {
  return {
    start: timeToDate(dateString, slot.startTime, timezone),
    finish: timeToDate(dateString, slot.finishTime, timezone),
  }
}

function timeToDate(dateString: string, time: string, timezone: string) {
  const startOfDay = dayjs.tz(dateString, timezone).startOf('day')
  const { hours, minutes } = parseTimeSlot(time)
  return startOfDay.add(hours, 'hours').add(minutes, 'minutes').tz(timezone)
}

function getShiftedTimeSlot(
  dateString: string,
  { startTime, finishTime }: TimeSlot,
  sourceTimezone: string,
  targetTimezone: string
) {
  return {
    startTime: dayjs
      .tz(`${dateString}T${startTime}:00`, sourceTimezone)
      .tz(targetTimezone)
      .format('HH:mm'),
    finishTime: dayjs
      .tz(`${dateString}T${finishTime}:00`, sourceTimezone)
      .tz(targetTimezone)
      .format('HH:mm'),
  }
}
