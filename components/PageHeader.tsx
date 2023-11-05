import React from 'react'

interface PageHeaderProps {
  text: string
}

export function PageHeader({ text }: PageHeaderProps) {
  return (
    <div className="flex my-5 text-center justify-center">
      <h1 className="font-bold">{text}</h1>
    </div>
  )
}
