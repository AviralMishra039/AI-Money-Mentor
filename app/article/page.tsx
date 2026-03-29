'use client'

import { useRouter } from 'next/navigation'
import { Calculator, Clock, TrendingUp, BookOpen, ArrowRight, Sparkles } from 'lucide-react'
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
    <div className="max-w-3xl mx-auto et-fade-in">
      {/* Article Header */}
      <div className="mb-10 border-b border-border pb-8">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/" className="et-badge bg-primary text-white px-2.5 py-1 hover:bg-primary-hover transition-colors">
            Markets
          </Link>
          <span className="et-badge bg-surface-warm text-text-tertiary border border-border">
            <Clock className="w-3 h-3 mr-1" />
            5 min read
          </span>
        </div>
        <h1 className="text-4xl sm:text-[42px] font-serif font-black leading-[1.15] text-navy mb-5 tracking-[-0.01em]">
          How ELSS Mutual Funds Can Save You Up To ₹46,800 Before March 31
        </h1>
        <p className="text-xl text-text-secondary font-serif leading-relaxed mb-6">
          With the financial year coming to a close, millions of salaried Indians are scrambling to find the best tax-saving instruments. ELSS continues to dominate the space.
        </p>
        
        {/* Byline */}
        <div className="flex items-center justify-between py-3 border-y border-border">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">ET</div>
            <div>
              <span className="font-bold text-navy block leading-tight">ET Bureau</span>
              <span className="text-text-tertiary text-xs">Updated: Mar 29, 2026, 08:45 AM IST</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="et-badge bg-success/10 text-success border border-success/20">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Trending
            </span>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="mb-12 space-y-6 text-text-primary">
        <p className="text-[17px] leading-[1.8] font-serif">
          As the March 31 deadline approaches, taxpayers are aggressively looking for last-minute avenues to reduce their tax liabilities under the old regime. While traditional instruments like PPF and FDs offer safety, Equity Linked Savings Schemes (ELSS) have emerged as the clear winner for those looking to combine tax saving with wealth creation.
        </p>
        
        {/* Pull quote */}
        <div className="border-l-[3px] border-primary pl-6 py-2 my-8">
          <p className="text-xl font-serif italic text-navy leading-relaxed">
            &ldquo;ELSS mutual funds come with a dual advantage: tax deductions up to ₹1.5 lakh under Section 80C, and equity-linked returns.&rdquo;
          </p>
        </div>

        <p className="text-[17px] leading-[1.8] font-serif">
          Moreover, with a lock-in period of just three years, they are the most liquid among all Section 80C investments. This makes ELSS an attractive option compared to NSC (5 years), FD (5 years), and PPF (15 years).
        </p>

        {/* Dynamic Contextual Widget */}
        <div className="my-10 et-panel overflow-hidden group">
          <div className="bg-navy px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-bold text-white/70 uppercase tracking-[0.15em]">ET Money Mentor Integration</span>
            </div>
            <span className="et-badge bg-primary/20 text-primary border border-primary/30">AI-Powered</span>
          </div>
          <div className="p-6 flex flex-col md:flex-row gap-6 items-center justify-between bg-gradient-to-r from-white to-surface">
            <div>
              <h3 className="font-serif font-bold text-xl text-navy mb-2">Calculate Your Tax Savings</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Are you a salaried professional earning ₹12 Lakhs? See exactly how much tax you can save this week based on your salary and current investments.
              </p>
            </div>
            <button 
              onClick={runContextPrefill}
              className="et-btn-primary w-full md:w-auto shrink-0 !py-3.5 !px-8"
            >
              <Calculator className="w-4 h-4" />
              Calculate My Tax Savings
            </button>
          </div>
        </div>

        <h3 className="font-serif font-bold text-2xl text-navy mt-10 mb-4 relative pl-4 border-l-[3px] border-primary">
          Why Should You Consider ELSS?
        </h3>
        
        <p className="text-[17px] leading-[1.8] font-serif">
          Historically, equities have outperformed most asset classes over the long term. By forcing a three-year lock-in, ELSS prevents investors from timing the market and encourages a disciplined approach to equity investing.
        </p>

        {/* Expert Quote */}
        <div className="et-panel p-6 border-l-[3px] border-gold my-8">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-[17px] font-serif italic text-navy leading-relaxed mb-2">
                &ldquo;The three-year lock-in is actually a blessing in disguise. It enforces patience, which is the most critical component of wealth creation.&rdquo;
              </p>
              <p className="text-xs text-text-tertiary font-bold uppercase tracking-[0.1em]">— Leading Financial Advisor</p>
            </div>
          </div>
        </div>

        <p className="text-[17px] leading-[1.8] font-serif">
          For taxpayers in the 30% bracket, a full ₹1.5 lakh investment under Section 80C through ELSS can result in a tax saving of up to ₹46,800 (including 4% cess). This is a significant amount that effectively reduces the cost of your investment.
        </p>

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-0 divide-x divide-border my-10 et-panel overflow-hidden">
          {[
            { value: '₹1.5L', label: 'Max 80C Deduction' },
            { value: '3 Years', label: 'Lock-in Period' },
            { value: '₹46,800', label: 'Max Tax Saved' },
          ].map((stat, i) => (
            <div key={i} className="p-6 text-center">
              <div className="text-2xl font-serif font-black text-navy mb-1">{stat.value}</div>
              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.12em]">{stat.label}</div>
            </div>
          ))}
        </div>

        <p className="text-[17px] leading-[1.8] font-serif">
          As the clock ticks toward March 31, investors would do well to evaluate their tax-saving portfolio and consider ELSS as a cornerstone of their financial planning strategy.
        </p>
      </div>

      {/* Related Widget */}
      <div className="et-divider mb-6">
        <span className="text-xs font-bold text-text-tertiary uppercase tracking-[0.15em]">Related Tools</span>
      </div>
      <div className="grid grid-cols-2 gap-0 et-stagger mb-8">
        {[
          { href: '/health', label: 'Money Health Check', desc: 'Score your financial wellness', icon: TrendingUp },
          { href: '/life-event', label: 'Life Event Planner', desc: 'Got a bonus? Plan it right', icon: ArrowRight },
        ].map(tool => (
          <Link key={tool.href} href={tool.href} className="et-card et-col-rule p-6 flex items-center gap-4 group">
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <tool.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-navy text-sm group-hover:text-primary transition-colors">{tool.label}</h4>
              <p className="text-xs text-text-tertiary">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
