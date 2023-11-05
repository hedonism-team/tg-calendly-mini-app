import { nanoid } from 'nanoid'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client'

import { CreateNewUserPayload } from '@/app/api/users/route'
import { UserModel } from '@/lib/models/User.model'

// TODO support extra fields
export async function createOrUpdateUser(user: CreateNewUserPayload) {
  const existingUser = await prisma.user.findUnique({ where: { id: user.id } })
  return mapDbUserToModel(
    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: {
        id: user.id,
        tag: getNewUserTag(),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
      update: {
        id: user.id,
        tag: existingUser?.tag ?? getNewUserTag(),
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

function getNewUserTag() {
  return nanoid(10)
}

function mapDbUserToModel({ id, tag, firstName, lastName, username }: User) {
  return {
    id: Number.parseInt(id.toString()),
    tag,
    firstName,
    lastName,
    username,
  } as UserModel
}
