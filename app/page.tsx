import Link from 'next/link'
import { ArrowRight, Activity, Calculator, Briefcase, Lock, Glasses, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-8 animate-in fade-in duration-500">
      <section className="text-center space-y-4 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight px-4 flex flex-col gap-2">
          <span>₹1,73,000 in tax savings go unclaimed</span>
          <span className="text-text-primary">by the average Indian salaried employee.</span>
        </h1>
        <p className="text-xl text-text-secondary font-medium">Find yours in 5 minutes.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/health" className="group rounded-xl border border-border bg-white p-6 hover:border-primary hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-xl mb-2 text-text-primary">Money Health</h3>
          <p className="text-text-secondary text-sm mb-4">Calculate your financial health score across 6 core dimensions and get AI-driven insights.</p>
          <div className="text-primary text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
            Start checkup <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
        
        <Link href="/tax" className="group rounded-xl border border-border bg-white p-6 hover:border-primary hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-xl mb-2 text-text-primary">Tax Wizard</h3>
          <p className="text-text-secondary text-sm mb-4">Compare new vs old regimes instantly and let AI find your missed 80C, 80D, and HRA deductions.</p>
          <div className="text-primary text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
            Optimize tax <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>

        <Link href="/life-event" className="group rounded-xl border border-border bg-white p-6 hover:border-primary hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-xl mb-2 text-text-primary">Life Event Advisor</h3>
          <p className="text-text-secondary text-sm mb-4">Got a bonus? Getting married? Get instant asset allocation and next-steps for financial windfalls.</p>
          <div className="text-primary text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
            Get advice <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </Link>
      </div>

      <section className="pt-8 border-t border-border">
        <h2 className="text-xl font-bold text-text-primary mb-6 text-center">Coming Soon</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border bg-surface p-6 opacity-60 mix-blend-luminosity grayscale pointer-events-none">
            <Lock className="w-6 h-6 text-text-secondary mb-3" />
            <h3 className="font-semibold text-lg mb-1">FIRE Planner</h3>
            <p className="text-xs text-text-secondary">AI paths to early retirement</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 opacity-60 mix-blend-luminosity grayscale pointer-events-none">
            <Glasses className="w-6 h-6 text-text-secondary mb-3" />
            <h3 className="font-semibold text-lg mb-1">MF X-Ray</h3>
            <p className="text-xs text-text-secondary">Portfolio overlap analysis</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6 opacity-60 mix-blend-luminosity grayscale pointer-events-none">
            <Users className="w-6 h-6 text-text-secondary mb-3" />
            <h3 className="font-semibold text-lg mb-1">Couple's Planner</h3>
            <p className="text-xs text-text-secondary">Joint wealth simulation</p>
          </div>
        </div>
      </section>
    </div>
  )
}
