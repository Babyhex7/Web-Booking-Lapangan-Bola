import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Booking Lapangan Bola',
  description: 'Sistem pemesanan lapangan bola online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
