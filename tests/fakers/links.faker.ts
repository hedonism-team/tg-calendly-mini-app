import { LinkModel } from '@/lib/models/Link.model'
import { fakeSchedule } from '@/tests/fakers/schedules.faker'

export function fakeLink(overrides: Partial<LinkModel> = {}) {
  return {
    id: 'my-link',
    userId: 1,
    timezone: 'Asia/Kamchatka',
    duration: { hours: 1, minutes: 0 },
    schedule: fakeSchedule(),
    ...overrides,
  } as LinkModel
}
