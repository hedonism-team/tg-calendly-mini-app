import { Bot, webhookCallback } from 'grammy'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bot = new Bot(String(process.env.BOT_TOKEN))
  console.log("Initialized instance successfully");

  // Handle the /start command.
  bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))
  // Handle other messages.
  bot.on('message', (ctx) => ctx.reply('Got another message!'))

  // Now that you specified how to handle messages, you can start your bot.
  // This will connect to the Telegram servers and wait for messages.

  // Create a request handler
  const handle = webhookCallback(bot, 'next-js')
  console.log('Created handler successfully')

  // Return the handler to Vercel api
  return await handle(req, res)
}
