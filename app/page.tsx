import { MainPageComponent } from '@/components/MainPage'

export default function Home() {
  // TODO remove
  const isProduction = process.env.NODE_ENV === 'production'
  const defaultUserId = !isProduction
    ? Number(process.env.TG_DEFAULT_USER_ID)
    : undefined
  const defaultStartParam = !isProduction
    ? process.env.TG_DEFAULT_START_PARAM
    : undefined

  return (
    <main className="container mx-auto max-w-7xl">
      <MainPageComponent
        isProduction={isProduction}
        defaultUserId={defaultUserId}
        defaultStartParam={defaultStartParam}
      />
    </main>
  )
}
