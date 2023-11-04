import { Bot } from 'grammy'

const {
  VERCEL_URL: host,
  // set your webhook address or use default Vercel deployment url
  WEBHOOK: webhook = `https://${host}/api/webhook`,
} = process.env

const { BOT_TOKEN: token = '' } = process.env

// Set your token in the vercel environment variable
export const bot = new Bot(token)

void bot.api.setWebhook(webhook)
