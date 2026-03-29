import { DisclaimerBanner } from './DisclaimerBanner'
import Link from 'next/link'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-white border-b-4 border-primary shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex flex-col">
            <span className="font-serif font-black text-2xl tracking-tighter text-black leading-none uppercase">The Economic Times</span>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-1">Money Mentor</span>
          </Link>
          <nav className="space-x-5 text-xs font-bold uppercase tracking-wider flex items-center">
            <Link href="/health" className="text-black hover:text-primary transition-colors">Health</Link>
            <Link href="/tax" className="text-black hover:text-primary transition-colors">Tax</Link>
            <Link href="/life-event" className="text-black hover:text-primary transition-colors mr-2">Life Event</Link>
            <Link href="/article" className="bg-black hover:bg-primary text-white border border-black hover:border-primary px-3 py-1.5 transition-colors">Live Article</Link>
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
