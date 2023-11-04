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
        <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
        <script>eruda.init();</script>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <title>Hello Meetly!</title>
      </head>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
