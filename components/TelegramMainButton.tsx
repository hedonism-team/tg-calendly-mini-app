import React, { useEffect } from 'react'
import { MainButton } from '@twa-dev/sdk/dist/react'

export function TelegramMainButton() {
  const [alertShown, setAlertShown] = React.useState<boolean>(false)

  useEffect(function mount() {
    setAlertShown(true)
    // function onScroll() {
    //   console.log('scroll!')
    // }
    //
    // window.addEventListener('scroll', onScroll)
    //
    // return function unMount() {
    //   window.removeEventListener('scroll', onScroll)
    // }
  }, [])

  return (
    <>
      {typeof window !== 'undefined' && (
        <MainButton text="Submit" onClick={() => alert('submitted')} />
      )}
    </>
  )
}
