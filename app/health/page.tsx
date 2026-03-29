'use client'

import { useState, useRef } from 'react'
import { HealthInputs, HealthScore, AIInsight } from '@/lib/types'
import { calcHealthScore, calculateProjectedWealth } from '@/lib/calculations'
import { orchestrate, AgentStep } from '@/lib/orchestrator'
import { ScoreRing } from '@/components/ScoreRing'
import { InsightCard } from '@/components/InsightCard'
import { AgentProgress } from '@/components/AgentProgress'
import { FileText, Loader2, ArrowRight, Activity } from 'lucide-react'

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

  const dimNames: Record<keyof HealthScore['dims'], string> = {
    emergency: 'Emergency Fund',
    insurance: 'Life Cover',
    investments: 'SIP Rate',
    debt: 'Debt Load',
    tax: 'Tax Efficiency',
    retirement: 'Retirement Track'
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm print:hidden">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" /> Money Health Checkup
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(Object.entries(inputs) as [string, number][]).map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary capitalize tracking-wide">
                {k.replace(/_/g, ' ')}
              </label>
              <input 
                type="number"
                value={v || ''}
                onChange={(e) => handleInputChange(k as keyof HealthInputs, e.target.value)}
                className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-surface"
              />
            </div>
          ))}
        </div>
        <button 
          onClick={handleCalculate}
          className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2.5 rounded-lg flex items-center justify-center w-full sm:w-auto transition-colors"
        >
          Analyse my finances <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {currentStep && currentStep !== 'error' && currentStep !== 'done' && (
        <AgentProgress currentStep={currentStep} />
      )}

      {score && (
        <div ref={resultRef} className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start mb-8 border-b border-border pb-6">
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-1">Your Financial Health</h3>
              <p className="text-sm text-text-secondary">AI-evaluated across 6 core parameters</p>
            </div>
            {!loadingAI && (
              <button 
                onClick={exportPDF} 
                className="text-primary text-sm font-medium px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-md flex items-center transition-colors print:hidden"
              >
                <FileText className="w-4 h-4 mr-2" /> Export Plan
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-10 mb-10 items-center justify-center">
            <div className="shrink-0">
              <ScoreRing score={score.overall} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full">
              {(Object.entries(score.dims) as [string, number][]).map(([dim, val]) => (
                <div key={dim} className="space-y-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-text-primary">{dimNames[dim as keyof typeof dimNames]}</span>
                    <span className={val >= 70 ? 'text-success' : val >= 50 ? 'text-warning' : 'text-danger'}>
                      {val}/100
                    </span>
                  </div>
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${val >= 70 ? 'bg-success' : val >= 50 ? 'bg-warning' : 'bg-danger'}`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-lg border-b border-border pb-2">AI Mentorship Actions</h4>
            {errorAI && (
               <div className="bg-amber-50 text-amber-800 p-3 rounded-md border border-amber-200 text-sm font-medium">
                 AI insights currently unavailable — showing calculated scores only.
               </div>
            )}
            {loadingAI && !errorAI && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-surface border border-border rounded-lg p-5 h-24 flex items-center justify-center gap-2 text-text-secondary font-medium text-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-primary opacity-50" />
                    Analyzing financial profile...
                  </div>
                ))}
              </div>
            )}
            {!loadingAI && insights.map((insight, idx) => (
              <InsightCard key={idx} insight={insight} />
            ))}
          </div>

          {!loadingAI && score.overall < 70 && (
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mt-8">
              <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-3">
                Estimated impact if you act on these recommendations
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 p-3 rounded border border-blue-100/50 text-center sm:text-left">
                  <p className="text-2xl font-bold text-blue-800">
                    ₹{calculateProjectedWealth(inputs, 'before').toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mt-1">Projected wealth at 60 (current path)</p>
                </div>
                <div className="bg-white/60 p-3 rounded border border-blue-100/50 text-center sm:text-left">
                  <p className="text-2xl font-bold text-success">
                    ₹{calculateProjectedWealth(inputs, 'after').toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs font-semibold text-success/80 uppercase tracking-wider mt-1">Projected wealth at 60 (with plan)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
