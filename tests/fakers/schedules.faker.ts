import { ScheduleModel } from '@/lib/models/Schedule.model'

export function fakeSchedule(overrides: Partial<ScheduleModel> = {}) {
  return {
    0: {
      startTime: '09:00',
      finishTime: '17:00',
    },
    1: {
      startTime: '09:00',
      finishTime: '17:00',
    },
    2: {
      startTime: '09:00',
      finishTime: '17:00',
    },
    3: {
      startTime: '09:00',
      finishTime: '17:00',
    },
    4: {
      startTime: '09:00',
      finishTime: '17:00',
    },
    5: null,
    6: null,
    ...overrides,
  } as ScheduleModel
}
