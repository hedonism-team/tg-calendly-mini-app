import { MainPageComponent } from '@/components/MainPage'

export default function Home() {
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <main className="container mx-auto max-w-7xl">
      <MainPageComponent isProduction={isProduction} />
    </main>
  )
}
