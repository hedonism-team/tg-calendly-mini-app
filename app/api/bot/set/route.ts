import { Bot } from 'grammy'

export async function GET() {
  const bot = new Bot(String(process.env.BOT_TOKEN))
  console.log('Initialized instance successfully')

  const address: string =
    'https://tg-calendly-mini-app.vercel.app/api/bot/webhook'

  try {
    const result = await bot.api.setWebhook(address)
    return Response.json({ status: 'Done. Set!', result })
  } catch (_) {
    return Response.json(
      { status: "Couldn't succeed with installing webhook!" },
      { status: 500 }
    )
  }
}
