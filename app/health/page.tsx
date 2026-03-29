'use client'

import { useState, useRef } from 'react'
import { HealthInputs, HealthScore, AIInsight } from '@/lib/types'
import { calcHealthScore, calculateProjectedWealth } from '@/lib/calculations'
import { orchestrate, AgentStep } from '@/lib/orchestrator'
import { ScoreRing } from '@/components/ScoreRing'
import { InsightCard } from '@/components/InsightCard'
import { AgentProgress } from '@/components/AgentProgress'
import { FileText, Loader2, ArrowRight, Activity, TrendingUp, IndianRupee } from 'lucide-react'

export default function HealthPage() {
  const [inputs, setInputs] = useState<HealthInputs>({
    monthly_income: 100000,
    monthly_expenses: 60000,
    emergency_fund_months: 2,
    term_insurance_lakhs: 50,
    monthly_sip: 15000,
    outstanding_debt: 200000,
    age: 30,
    tax_saving_yearly: 50000
  })

  const [score, setScore] = useState<HealthScore | null>(null)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [errorAI, setErrorAI] = useState(false)
  const [currentStep, setCurrentStep] = useState<AgentStep | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const handleCalculate = async () => {
    setScore(null)
    setInsights([])
    setLoadingAI(true)
    setErrorAI(false)
    setCurrentStep('validating')

    const result = await orchestrate('health', inputs as any, (step) => {
      setCurrentStep(step)
    })

    if (!result.success) {
      setErrorAI(true)
      setLoadingAI(false)
      setCurrentStep('error')
      alert('Validation Error: ' + result.error)
      return
    }

    setScore(result.calculated_data as any)
    
    if (result.ai_output && result.ai_output.insights) {
      setInsights(result.ai_output.insights as AIInsight[])
    } else {
      setErrorAI(true)
    }
    setLoadingAI(false)
  }

  const exportPDF = () => {
    window.print()
  }

  const handleInputChange = (field: keyof HealthInputs, value: string) => {
    setInputs((prev: HealthInputs) => ({ ...prev, [field]: Number(value) || 0 }))
  }

  const labelNames: Record<keyof HealthInputs, string> = {
    monthly_income: 'Monthly Income (₹)',
    monthly_expenses: 'Monthly Expenses (₹)',
    emergency_fund_months: 'Emergency Fund (Months)',
    term_insurance_lakhs: 'Term Insurance Cover (₹ Lakhs)',
    monthly_sip: 'Monthly SIP (₹)',
    outstanding_debt: 'Outstanding Loans (₹)',
    age: 'Current Age',
    tax_saving_yearly: '80C/Tax Investments (₹ / Yr)'
  }

  const dimNames: Record<keyof HealthScore['dims'], string> = {
    emergency: 'Emergency Fund',
    insurance: 'Life Cover',
    investments: 'SIP Rate',
    debt: 'Debt Load',
    tax: 'Tax Efficiency',
    retirement: 'Retirement Track'
  }

  const dimColors: Record<string, string> = {
    emergency: '#7c3aed',
    insurance: '#0891b2',
    investments: '#16a34a',
    debt: '#dc2626',
    tax: '#d97706',
    retirement: '#2563eb',
  }

  return (
    <div className="space-y-8 et-fade-in">
      {/* Input Form */}
      <div className="et-panel p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-2xl text-navy">Money Health Checkup</h2>
            <p className="text-xs text-text-tertiary mt-0.5">AI-powered financial wellness evaluation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {(Object.entries(inputs) as [string, number][]).map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1.5">
              <label className="et-label">
                {labelNames[k as keyof HealthInputs]}
              </label>
              <div className="relative">
                {k !== 'age' && k !== 'emergency_fund_months' && (
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                )}
                <input 
                  type="number"
                  value={v || ''}
                  onChange={(e) => handleInputChange(k as keyof HealthInputs, e.target.value)}
                  className={`et-input ${k !== 'age' && k !== 'emergency_fund_months' ? '!pl-8' : ''}`}
                />
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={handleCalculate}
          className="et-btn-primary w-full sm:w-auto"
        >
          Analyse my finances <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {currentStep && currentStep !== 'error' && currentStep !== 'done' && (
        <AgentProgress currentStep={currentStep} />
      )}

      {score && (
        <div ref={resultRef} className="space-y-8 et-slide-up">
          {/* Score Overview */}
          <div className="et-panel p-8">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-border">
              <div>
                <h3 className="et-section-header text-2xl mb-0 pb-0 after:hidden">Your Financial Health</h3>
                <p className="text-sm text-text-tertiary mt-1">AI-evaluated across 6 core parameters</p>
              </div>
              {!loadingAI && (
                <button 
                  onClick={exportPDF} 
                  className="et-badge bg-navy text-white px-3 py-1.5 cursor-pointer hover:bg-primary transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> Export Plan
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-12 mb-0 items-center justify-center">
              <div className="shrink-0">
                <ScoreRing score={score.overall} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 w-full">
                {(Object.entries(score.dims) as [string, number][]).map(([dim, val]) => (
                  <div key={dim} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-navy">{dimNames[dim as keyof typeof dimNames]}</span>
                      <span className="font-bold" style={{ color: val >= 70 ? '#16a34a' : val >= 50 ? '#d97706' : '#dc2626' }}>
                        {val}<span className="text-text-tertiary font-normal text-xs">/100</span>
                      </span>
                    </div>
                    <div className="h-[6px] bg-surface-warm rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-[1200ms] ease-out"
                        style={{ 
                          width: `${val}%`, 
                          backgroundColor: dimColors[dim] || (val >= 70 ? '#16a34a' : val >= 50 ? '#d97706' : '#dc2626') 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="space-y-4">
            <h4 className="et-section-header text-xl">AI Mentorship Actions</h4>
            
            {errorAI && (
              <div className="et-panel p-4 border-l-[3px] border-l-warning">
                <p className="text-sm font-medium text-warning flex items-center gap-2">
                  <span className="et-badge bg-warning/10 text-warning border border-warning/20">Notice</span>
                  AI insights currently unavailable — showing calculated scores only.
                </p>
              </div>
            )}
            
            {loadingAI && !errorAI && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="et-panel p-6 flex items-center justify-center gap-3 text-text-tertiary">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm font-medium">Analyzing financial profile...</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="space-y-4 et-stagger">
              {!loadingAI && insights.map((insight, idx) => (
                <InsightCard key={idx} insight={insight} />
              ))}
            </div>
          </div>

          {/* Wealth Projection */}
          {!loadingAI && score.overall < 70 && (
            <div className="et-panel overflow-hidden">
              <div className="bg-navy px-6 py-4">
                <p className="text-[11px] text-white/60 font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Estimated Impact If You Act
                </p>
              </div>
              <div className="grid grid-cols-2 gap-0 divide-x divide-border">
                <div className="p-6 text-center">
                  <p className="text-3xl font-serif font-black text-text-secondary mb-2">
                    ₹{calculateProjectedWealth(inputs, 'before').toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.1em]">
                    Current Path → Age 60
                  </p>
                </div>
                <div className="p-6 text-center bg-success/[0.03]">
                  <p className="text-3xl font-serif font-black text-success mb-2">
                    ₹{calculateProjectedWealth(inputs, 'after').toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] font-bold text-success/60 uppercase tracking-[0.1em]">
                    With Plan → Age 60
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
