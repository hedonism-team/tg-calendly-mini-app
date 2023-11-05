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

export async function sendNewAppointmentNotification({
  id: appointmentId,
  userId,
  requestingUserId,
}: AppointmentModel) {
  // TODO add clickable link to Tg profile
  const responseText = `You've got a new appointment from User#${requestingUserId}`
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
  const { requestingUserId } = await getAppointmentById(appointmentId)
  await updateAppointmentStatus(appointmentId, appointmentStatus)
  // TODO add clickable link to Tg profile
  const responseText = `You've ${appointmentStatus} an upcoming appointment with User#${requestingUserId}`
  await bot.api.editMessageText(chatId, messageId, responseText)
}

export async function sendAppointmentRequestResultNotification(
  appointmentId: number,
  appointmentStatus: AppointmentStatus
) {
  const { userId, requestingUserId } = await getAppointmentById(appointmentId)
  // TODO add clickable link to Tg profile
  const responseText = `Your request has been ${appointmentStatus} by User#${userId}`
  const result = await bot.api.sendMessage(requestingUserId, responseText)
  console.log('[AppointmentRequestResultNotification] result', result)
  return result
}
