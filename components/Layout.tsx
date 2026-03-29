'use client'

import { DisclaimerBanner } from './DisclaimerBanner'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TrendingUp, BarChart3, Newspaper } from 'lucide-react'

const TICKER_ITEMS = [
  'SENSEX 82,134.61 ▲ +0.87%',
  'NIFTY 50 24,998.45 ▲ +0.92%',
  'BANK NIFTY 51,234.10 ▲ +1.12%',
  'GOLD ₹92,450 ▲ +0.34%',
  'USD/INR 83.42 ▼ -0.08%',
  'CRUDE $78.90 ▼ -1.24%',
  'BITCOIN $94,234 ▲ +2.45%',
  'SGB 2029 ₹6,124 ▲ +0.12%',
]

const NAV_LINKS = [
  { href: '/health', label: 'Health' },
  { href: '/tax', label: 'Tax' },
  { href: '/life-event', label: 'Life Event' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Market Ticker Bar */}
      <div className="et-ticker py-1.5 print:hidden">
        <div className="et-ticker-content text-xs text-white/80 font-medium tracking-wide">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center mx-6">
              <TrendingUp className="w-3 h-3 mr-1.5 opacity-60" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b-[3px] border-primary shadow-[0_2px_12px_rgba(0,0,0,0.04)] print:hidden relative z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex flex-col group">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-black text-[26px] tracking-[-0.02em] text-navy leading-none uppercase">
                The Economic Times
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block w-5 h-[2px] bg-primary" />
              <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">
                Money Mentor
              </span>
              <span className="et-badge bg-navy text-white rounded-sm">AI</span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300
                    ${isActive 
                      ? 'text-primary' 
                      : 'text-navy hover:text-primary'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full" />
                  )}
                </Link>
              )
            })}
            <Link
              href="/article"
              className={`ml-2 flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition-all duration-300 border border-navy
                ${pathname === '/article'
                  ? 'bg-primary border-primary text-white'
                  : 'bg-navy text-white hover:bg-primary hover:border-primary'
                }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              Live Article
            </Link>
          </nav>
        </div>
      </header>

      {/* Date bar — newspaper style */}
      <div className="bg-surface-warm border-b border-border print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] text-text-tertiary font-medium">
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="w-1 h-1 rounded-full bg-text-tertiary" />
            <span className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Markets Open
            </span>
          </div>
          <div className="text-[11px] text-text-tertiary font-medium">
            Edition: India
          </div>
        </div>
      </div>
      
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        {children}
      </main>
      
      {/* Premium Footer */}
      <footer className="bg-navy text-white mt-auto print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="font-serif font-black text-xl tracking-tight uppercase mb-1">
                The Economic Times
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-[1.5px] bg-primary" />
                <span className="text-[9px] font-bold text-primary tracking-[0.2em] uppercase">Money Mentor</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/50 font-medium">
              <Link href="/health" className="hover:text-white transition-colors">Health Check</Link>
              <Link href="/tax" className="hover:text-white transition-colors">Tax Wizard</Link>
              <Link href="/life-event" className="hover:text-white transition-colors">Life Events</Link>
              <Link href="/audit" className="hover:text-white/80 transition-colors opacity-50 hover:opacity-100">Audit Log</Link>
            </div>
          </div>
          <div className="pt-6">
            <DisclaimerBanner />
            <p className="text-[11px] text-white/30 mt-4 text-center">
              © {new Date().getFullYear()} Times Internet Limited. All rights reserved. ET Money Mentor is an AI-powered prototype.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
