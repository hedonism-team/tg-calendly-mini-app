import './globals.css'
import Script from 'next/script'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://cdn.jsdelivr.net/npm/eruda"></Script>
        <Script id="eruda-init">eruda.init();</Script>
        <Script src="https://telegram.org/js/telegram-web-app.js"></Script>
        <title>Hello Meetly!</title>
      </head>
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  )
}
