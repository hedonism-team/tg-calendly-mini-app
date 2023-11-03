import { fakeLink } from '@/tests/fakers/links.faker'

// TODO implement (make it as server action?)
export async function getLinkById(linkId: string) {
  return fakeLink({ id: linkId })
}
