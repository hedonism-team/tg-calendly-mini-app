import { Bot, webhookCallback } from 'grammy'

const bot = new Bot(String(process.env.BOT_TOKEN))

// Handle the /start command.
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))
// Handle other messages.
bot.on('message', (ctx) => ctx.reply('Got another message!'))

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

export default webhookCallback(bot, 'next-js')
