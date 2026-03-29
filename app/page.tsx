import Link from 'next/link'
import { ArrowRight, Activity, Calculator, Briefcase, Lock, Glasses, Users, Sparkles, Shield, Zap } from 'lucide-react'

const FEATURES = [
  {
    href: '/health',
    icon: Activity,
    label: 'Money Health',
    tagline: 'Score & Fix',
    description: 'Calculate your financial health score across 6 core dimensions and get AI-driven personalised insights.',
    cta: 'Start checkup',
    accent: '#16a34a',
  },
  {
    href: '/tax',
    icon: Calculator,
    label: 'Tax Wizard',
    tagline: 'Save More',
    description: 'Compare new vs old regimes instantly and let AI find your missed 80C, 80D, and HRA deductions.',
    cta: 'Optimize tax',
    accent: '#d97706',
  },
  {
    href: '/life-event',
    icon: Briefcase,
    label: 'Life Event Advisor',
    tagline: 'Plan Ahead',
    description: 'Got a bonus? Getting married? Get instant asset allocation and next-steps for financial windfalls.',
    cta: 'Get advice',
    accent: '#7c3aed',
  },
]

const COMING_SOON = [
  { icon: Lock, label: 'FIRE Planner', desc: 'AI paths to early retirement' },
  { icon: Glasses, label: 'MF X-Ray', desc: 'Portfolio overlap analysis' },
  { icon: Users, label: "Couple's Planner", desc: 'Joint wealth simulation' },
]

export default function Home() {
  return (
    <div className="et-fade-in">
      {/* Hero Section */}
      <section className="relative text-center py-16 mb-12">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/[0.04] via-transparent to-gold/[0.04] rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-3xl mx-auto space-y-6">
          {/* ET brand tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-border rounded-full text-xs font-semibold text-text-secondary shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Powered by AI &middot; Built by The Economic Times
          </div>

          <h1 className="text-5xl sm:text-6xl font-serif font-black tracking-[-0.02em] text-navy leading-[1.1]">
            Your AI{' '}
            <span className="et-gradient-text">Financial</span>
            <br />
            Mentor
          </h1>

          <p className="text-lg text-text-secondary max-w-lg mx-auto leading-relaxed">
            95% of Indians have no financial plan. 
            <span className="font-semibold text-text-primary"> Fix that in 5 minutes</span> with 
            India&apos;s most trusted financial intelligence.
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary">
              <Shield className="w-3.5 h-3.5 text-success" />
              Bank-grade encryption
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary">
              <Zap className="w-3.5 h-3.5 text-warning" />
              Real-time calculations
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              FY 2025-26 updated
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 et-stagger">
          {FEATURES.map((f, i) => (
            <Link 
              key={f.href} 
              href={f.href} 
              className={`group et-card p-8 flex flex-col ${i < 2 ? 'et-col-rule' : ''}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="w-12 h-12 rounded flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${f.accent}10`, color: f.accent }}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <span className="et-badge bg-surface-warm text-text-tertiary border border-border">
                  {f.tagline}
                </span>
              </div>

              <h3 className="font-serif font-bold text-2xl text-navy mb-3 group-hover:text-primary transition-colors duration-300">
                {f.label}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-1">
                {f.description}
              </p>

              <div className="flex items-center text-primary text-sm font-semibold tracking-wide group-hover:gap-3 gap-1.5 transition-all duration-300">
                {f.cta} 
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Coming Soon */}
      <section>
        <div className="et-divider mb-8">
          <span className="text-xs font-bold text-text-tertiary uppercase tracking-[0.15em]">
            Coming Soon
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 et-stagger">
          {COMING_SOON.map((item) => (
            <div 
              key={item.label}
              className="relative p-6 bg-white/50 border border-border rounded overflow-hidden group cursor-default"
            >
              {/* Locked overlay */}
              <div className="absolute inset-0 bg-cream/40 backdrop-blur-[1px] z-10" />
              <div className="relative z-0">
                <div className="w-10 h-10 bg-surface-warm rounded flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-text-tertiary" />
                </div>
                <h3 className="font-serif font-bold text-lg text-navy mb-1">{item.label}</h3>
                <p className="text-xs text-text-secondary">{item.desc}</p>
              </div>
              <div className="absolute top-4 right-4 z-20">
                <Lock className="w-4 h-4 text-text-tertiary" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
