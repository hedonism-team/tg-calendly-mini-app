import './globals.css'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Meetly — a Telegram bot for time booking</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
