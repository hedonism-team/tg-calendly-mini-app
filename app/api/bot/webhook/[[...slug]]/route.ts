import { Bot, webhookCallback } from 'grammy'

function getHandler() {
  const bot = new Bot(String(process.env.BOT_TOKEN))
  console.log('Initialized instance successfully')

  // Handle the /start command.
  bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))
  // Handle other messages.
  bot.on('message', (ctx) => ctx.reply('Got another message!'))

  // Now that you specified how to handle messages, you can start your bot.
  // This will connect to the Telegram servers and wait for messages.

  // Return the handler to Vercel api
  return webhookCallback(bot, 'next-js')
}

export async function GET(request: Request) {
  console.log('GET', request.json())
  return getHandler()(request)
}

export async function HEAD(request: Request) {
  console.log('HEAD', request.json())
  return getHandler()(request)
}

export async function POST(request: Request) {
  console.log('POST', request.json())
  return getHandler()(request)
}

export async function PUT(request: Request) {
  console.log('PUT', request.json())
  return getHandler()(request)
}

export async function DELETE(request: Request) {
  console.log('DELETE', request.json())
  return getHandler()(request)
}

export async function PATCH(request: Request) {
  console.log('PATCH', request.json())
  return getHandler()(request)
}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: Request) {
  console.log('OPTIONS', request.json())
  return getHandler()(request)
}
