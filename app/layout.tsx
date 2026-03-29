import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/Layout'

export const metadata: Metadata = {
  title: 'ET Money Mentor',
  description: 'Your AI Financial Mentor for Indian Users',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-text-primary bg-surface">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
