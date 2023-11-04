import prisma from '@/lib/prisma'
import { CreateNewUserPayload } from '@/app/api/users/route'

// TODO support extra fields
export async function createUserIfNotExists(user: CreateNewUserPayload) {
  return prisma.user.upsert({
    where: {
      id: user.id,
    },
    create: {
      id: user.id,
    },
    update: {
      id: user.id,
    },
  })
}
