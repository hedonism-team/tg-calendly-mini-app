// TODO implement
import { DateRange } from '@/lib/services/timeSlots.service'
import { Dayjs } from 'dayjs'

export function doRangesIntersect(
  firstRange: DateRange,
  secondRange: DateRange
) {
  return (
    firstRange.start.isBetween(
      secondRange.start,
      secondRange.finish,
      'minutes',
      '[)'
    ) ||
    firstRange.finish.isBetween(
      secondRange.start,
      secondRange.finish,
      'minutes',
      '(]'
    )
  )
}

export function getWeekday(date: Dayjs) {
  return (7 + date.day() - 1) % 7
}
