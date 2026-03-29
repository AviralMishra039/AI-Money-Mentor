'use client'

import { useRouter } from 'next/navigation'
import { Calculator } from 'lucide-react'
import Link from 'next/link'

export default function ArticlePage() {
  const router = useRouter()

  const runContextPrefill = () => {
    const articleData = {
      feature: "tax",
      annual_ctc: 1200000,
      hra_received: 150000,
      rent_paid: 120000,
      is_metro: true,
      investments_80c: 50000,
      nps_80ccd: 0,
      home_loan_interest: 0,
      medical_80d: 0
    }
    sessionStorage.setItem('demo_scenario', JSON.stringify(articleData))
    sessionStorage.setItem('article_referral', 'true')
    router.push('/tax')
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Article Header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/" className="bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-widest px-2 py-1 transition-colors">Markets</Link>
        </div>
        <h1 className="text-4xl font-serif font-black leading-tight text-text-primary mb-4">
          How ELSS Mutual Funds Can Save You Up To ₹46,800 Before March 31
        </h1>
        <p className="text-xl text-text-secondary font-serif leading-relaxed mb-6">
          With the financial year coming to a close, millions of salaried Indians are scrambling to find the best tax-saving instruments. ELSS continues to dominate the space.
        </p>
        <div className="flex items-center justify-between text-sm text-text-secondary border-y border-border py-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary">By ET Bureau</span>
            <span>|</span>
            <span>Updated: Mar 29, 2026, 08:45 AM IST</span>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="prose prose-lg max-w-none font-serif text-text-primary mb-12">
        <p className="mb-6 leading-relaxed">
          As the March 31 deadline approaches, taxpayers are aggressively looking for last-minute avenues to reduce their tax liabilities under the old regime. While traditional instruments like PPF and FDs offer safety, Equity Linked Savings Schemes (ELSS) have emerged as the clear winner for those looking to combine tax saving with wealth creation.
        </p>
        
        <p className="mb-6 leading-relaxed">
          ELSS mutual funds come with a dual advantage: they qualify for tax deductions of up to ₹1.5 lakh under Section 80C of the Income Tax Act, and they offer the potential for equity-linked returns. Moreover, with a lock-in period of just three years, they are the most liquid among all Section 80C investments.
        </p>

        {/* Dynamic Contextual Widget */}
        <div className="my-10 bg-surface border-2 border-primary/20 rounded-xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-black uppercase tracking-wide">ET Money Mentor Integration</h3>
              </div>
              <p className="text-text-secondary text-sm md:text-base mb-0">
                Are you a salaried professional earning ₹12 Lakhs? See exactly how much tax you can save this week based on your salary and current investments.
              </p>
            </div>
            <button 
              onClick={runContextPrefill}
              className="w-full md:w-auto shrink-0 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded shadow-md transition-colors flex items-center justify-center gap-2"
            >
              Calculate My Tax Savings
            </button>
          </div>
        </div>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">Why Should You Consider ELSS?</h3>
        
        <p className="mb-6 leading-relaxed">
          Historically, equities have outperformed most asset classes over the long term. By forcing a three-year lock-in, ELSS prevents investors from timing the market and encourages a disciplined approach to equity investing.
        </p>
        
        <p className="mb-6 leading-relaxed">
          "The three-year lock-in is actually a blessing in disguise," says a leading financial advisor. "It enforces patience, which is the most critical component of wealth creation."
        </p>
      </div>

    </div>
  )
}
