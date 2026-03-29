import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/Layout'

export const metadata: Metadata = {
  title: 'ET Money Mentor | The Economic Times',
  description: 'AI-powered financial mentoring for Indian investors. Get instant health checks, tax optimization, and life event planning from The Economic Times.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
