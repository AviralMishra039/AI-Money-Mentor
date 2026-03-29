import { DisclaimerBanner } from './DisclaimerBanner'
import Link from 'next/link'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-white border-b border-border py-4">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-primary tracking-tight">
            ET Money<span className="text-text-primary">Mentor</span>
          </Link>
          <nav className="space-x-4 text-sm font-medium flex items-center">
            <Link href="/health" className="text-text-secondary hover:text-primary transition-colors">Health</Link>
            <Link href="/tax" className="text-text-secondary hover:text-primary transition-colors">Tax</Link>
            <Link href="/life-event" className="text-text-secondary hover:text-primary transition-colors mr-2">Life Event</Link>
            <Link href="/demo" className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md transition-colors font-semibold">Run Demo</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {children}
      </main>
      
      <footer className="py-6 mt-auto bg-white border-t border-border">
        <div className="max-w-4xl mx-auto px-4">
          <DisclaimerBanner />
        </div>
      </footer>
    </div>
  )
}
