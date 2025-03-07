import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BetPal - Friendly Betting',
  description: 'Make friendly wagers with your friends',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}