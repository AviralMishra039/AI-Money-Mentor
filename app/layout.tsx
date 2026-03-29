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
      <body className="antialiased min-h-screen text-text-primary bg-surface flex flex-col">
        <Layout>{children}</Layout>
        <footer className="mt-auto py-6 border-t border-border mt-12 text-center text-xs text-text-secondary">
          <a href="/audit" className="opacity-50 hover:opacity-100 transition-opacity">System Audit Log</a>
        </footer>
      </body>
    </html>
  )
}
