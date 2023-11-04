import { Bot } from 'grammy'
import { AppointmentStatus } from '@/lib/models/Appointment.model'
import {
  sendAppointmentRequestResultNotification,
  updateNewAppointmentNotification,
} from '@/lib/services/notifications.service'

const { BOT_TOKEN: token = '' } = process.env
export const bot = new Bot(token)

// TODO refactor
bot.on('message', async (ctx) => {
  await ctx.reply('Hi there!')
})

bot.on('callback_query:data', async (ctx) => {
  const { data } = ctx.callbackQuery
  console.log('callbackQuery: data', data)

  if (
    data.startsWith(AppointmentStatus.approved) ||
    data.startsWith(AppointmentStatus.rejected)
  ) {
    const chatId = ctx.callbackQuery.message?.chat.id
    const messageId = ctx.callbackQuery.message?.message_id
    const appointmentId = parseAppointmentId(data)
    const appointmentStatus = parseAppointmentStatus(data)
    if (!chatId || !messageId || !appointmentId || !appointmentStatus) {
      console.log('callbackQuery: invalid data')
      await ctx.answerCallbackQuery({ show_alert: true, text: 'Invalid data' })
      return
    }
    await updateNewAppointmentNotification({
      chatId,
      messageId,
      appointmentId,
      appointmentStatus,
    })
    await sendAppointmentRequestResultNotification(
      appointmentId,
      appointmentStatus
    )
    await ctx.answerCallbackQuery({ show_alert: true, text: 'Success' })
  }

  await ctx.answerCallbackQuery({ show_alert: true, text: 'Unknown action' })
})

// private

function parseAppointmentId(data: string): number | undefined {
  return Number(data.split('|')[1]) ?? undefined
}

function parseAppointmentStatus(data: string): AppointmentStatus | undefined {
  return (data.split('|')[0] as AppointmentStatus) ?? undefined
}
