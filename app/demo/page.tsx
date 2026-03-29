'use client'

import { useRouter } from 'next/navigation'
import { Play, User } from 'lucide-react'

export default function DemoPage() {
  const router = useRouter()

  const runPriya = () => {
    const priyaData = {
      feature: "tax",
      annual_ctc: 1500000,
      hra_received: 240000,
      rent_paid: 180000,
      is_metro: true,
      investments_80c: 80000,
      nps_80ccd: 0,
      home_loan_interest: 0,
      medical_80d: 0
    }
    sessionStorage.setItem('demo_scenario', JSON.stringify(priyaData))
    router.push('/tax')
  }

  const runRahul = () => {
    const rahulData = {
      feature: "life_event",
      event_type: "bonus",
      event_amount: 500000,
      age: 31,
      monthly_income: 100000,
      tax_bracket: 30,
      risk_profile: "moderate",
      existing_debt: 800000,
      debt_interest_rate: 14
    }
    sessionStorage.setItem('demo_scenario', JSON.stringify(rahulData))
    router.push('/life-event')
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-12 animate-in slide-in-from-bottom-8 duration-500">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-3xl font-bold">One-Click Demos</h1>
        <p className="text-text-secondary">Run these pre-configured user scenarios to see the AI and calculation engines in action instantly.</p>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 hover:border-primary transition-colors cursor-pointer group" onClick={runPriya}>
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Priya, 28</h2>
              <p className="text-sm font-medium text-text-primary mb-2">₹15L CTC • Tax Optimization Engine</p>
              <p className="text-sm text-text-secondary">Priya currently uses the Old regime and misses NPS deductions. The system will calculate both regimes, recommend Old, and identify a ₹50K NPS 80CCD gap saving her ₹15,600.</p>
            </div>
          </div>
          <button className="bg-primary text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
            <Play className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6 hover:border-primary transition-colors cursor-pointer group" onClick={runRahul}>
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">Rahul, 31</h2>
              <p className="text-sm font-medium text-text-primary mb-2">₹5L Bonus • Life Event Advisor (Edge Case)</p>
              <p className="text-sm text-text-secondary">Rahul receives a ₹5L bonus but has ₹8L in high-interest (14%) debt. The system overrides standard equity allocation to emphasize immediate loan prepayment.</p>
            </div>
          </div>
          <button className="bg-primary text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
            <Play className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  )
}
