import prisma from '@/lib/prisma'
import { CreateNewUserPayload } from '@/app/api/users/route'
import { User } from '.prisma/client'
import { UserModel } from '@/lib/models/User.model'

// TODO support extra fields
export async function createOrUpdateUser(user: CreateNewUserPayload) {
  return mapDbUserToModel(
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
      update: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    })
  )
}

export async function getUserById(id: number) {
  const dbUser = await prisma.user.findUnique({ where: { id } })
  if (!dbUser) {
    return null
  }
  return mapDbUserToModel(dbUser)
}

// private

function mapDbUserToModel({ id, firstName, lastName, username }: User) {
  return {
    id: Number.parseInt(id.toString()),
    firstName,
    lastName,
    username,
  } as UserModel
}
