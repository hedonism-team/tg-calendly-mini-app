import { InlineKeyboard } from 'grammy'

import { bot } from '@/lib/bot'
import {
  AppointmentModel,
  AppointmentStatus,
} from '@/lib/models/Appointment.model'
import {
  getAppointmentById,
  updateAppointmentStatus,
} from '@/lib/services/appointments.service'
import { UserModel } from '@/lib/models/User.model'
import { LinkModel } from '@/lib/models/Link.model'
import { getUserById } from '@/lib/services/users.service'

export async function sendNewAppointmentNotification({
  id: appointmentId,
  userId,
  requestingUserId,
  date,
  timeSlot,
}: AppointmentModel) {
  const requestingUser = await getUserById(requestingUserId)
  const responseText = `You've got a new appointment from ${getUserNickname(
    requestingUser!
  )}. Details: ${date} at ${timeSlot.startTime}`
  const inlineKeyboard = new InlineKeyboard()
    .text('❌ Reject', `${AppointmentStatus.rejected}|${appointmentId}`)
    .text('✅ Approve', `${AppointmentStatus.approved}|${appointmentId}`)
  const result = await bot.api.sendMessage(userId, responseText, {
    reply_markup: inlineKeyboard,
  })
  console.log('[NewAppointmentNotification] result', result)
  return result
}

export async function updateNewAppointmentNotification({
  appointmentId,
  appointmentStatus,
  chatId,
  messageId,
}: {
  appointmentId: number
  appointmentStatus: AppointmentStatus
  chatId: number
  messageId: number
}) {
  const { requestingUserId, date, timeSlot } = await getAppointmentById(
    appointmentId
  )
  const requestingUser = await getUserById(requestingUserId)
  await updateAppointmentStatus(appointmentId, appointmentStatus)
  const responseText = `You've ${appointmentStatus} an upcoming appointment with ${getUserNickname(
    requestingUser!
  )}. Details: ${date} at ${timeSlot.startTime}`
  await bot.api.editMessageText(chatId, messageId, responseText)
}

export async function sendAppointmentRequestResultNotification(
  appointmentId: number,
  appointmentStatus: AppointmentStatus
) {
  const { userId, requestingUserId } = await getAppointmentById(appointmentId)
  const hostUser = await getUserById(userId)
  const responseText = `Your request has been ${appointmentStatus} by ${getUserNickname(
    hostUser!
  )}`
  const result = await bot.api.sendMessage(requestingUserId, responseText)
  console.log('[AppointmentRequestResultNotification] result', result)
  return result
}

export async function sendLinkCreatedNotification({ id, userId }: LinkModel) {
  await bot.api.sendMessage(userId, getLinkCreatedMessageText(id), {
    parse_mode: 'HTML',
  })
  await bot.api.sendMessage(userId, getSharableMessageText(id), {
    parse_mode: 'HTML',
  })
}

export async function sendLinkUpdatedNotification({ id, userId }: LinkModel) {
  await bot.api.sendMessage(userId, getLinkUpdatedMessageText(id), {
    parse_mode: 'HTML',
  })
  await bot.api.sendMessage(userId, getSharableMessageText(id), {
    parse_mode: 'HTML',
  })
}

// helpers

export function getLinkCreatedMessageText(id: LinkModel['id']) {
  return `<b>🎉 Your link created!</b>\n\nUse this link to receive incoming booking requests\n\n<code>${getFullLink(
    id
  )}</code>\n\nShare the message below to start getting bookings`
}

export function getLinkUpdatedMessageText(id: LinkModel['id']) {
  return `<b>♻️ Your link updated!</b>\n\nShare the message below to start getting bookings`
}

export function getSharableMessageText(id: LinkModel['id']) {
  return `Book my time by clicking <a href="${getFullLink(id)}">here</a>`
}

export function getMyLinkMessageText(id: LinkModel['id']) {
  return `Use this link to receive incoming booking requests\n\n<code>${getFullLink(
    id
  )}</code>\n\nShare the message below to start getting bookings`
}

export function getFullLink(id: LinkModel['id']) {
  return `https://t.me/meetly_bot/app?startapp=l_${id}`
}

export function getUserNickname(user: UserModel) {
  let response
  if (user.username) {
    response = `@${user.username}`
  } else {
    response = `${user.firstName ?? ''} ${user.lastName ?? ''}`
  }
  return response
}
