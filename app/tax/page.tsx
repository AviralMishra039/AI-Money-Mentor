'use client'

import { useState, useEffect } from 'react'
import { TaxInputs, TaxResult, AIInsight } from '@/lib/types'
import { orchestrate, AgentStep } from '@/lib/orchestrator'
import { AgentProgress } from '@/components/AgentProgress'
import { Calculator, ArrowRight, Info, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react'

export default function TaxWizardPage() {
  const [inputs, setInputs] = useState<TaxInputs>({
    annual_ctc: 1500000,
    hra_received: 240000,
    rent_paid: 180000,
    is_metro: true,
    investments_80c: 150000,
    nps_80ccd: 50000,
    home_loan_interest: 0,
    medical_80d: 25000,
  })

  const [result, setResult] = useState<TaxResult | null>(null)
  const [missedDeductions, setMissedDeductions] = useState<any[]>([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [errorAI, setErrorAI] = useState(false)
  const [currentStep, setCurrentStep] = useState<AgentStep | null>(null)

  const handleCalculate = async (calcInputs = inputs) => {
    setResult(null)
    setMissedDeductions([])
    setLoadingAI(true)
    setErrorAI(false)
    setCurrentStep('validating')

    const res = await orchestrate('tax', calcInputs as any, (step) => {
      setCurrentStep(step)
    })

    if (!res.success) {
      setErrorAI(true)
      setLoadingAI(false)
      setCurrentStep('error')
      alert('Validation Error: ' + res.error)
      return
    }

    setResult(res.calculated_data as any)

    if (res.ai_output && res.ai_output.missed_deductions) {
      setMissedDeductions(res.ai_output.missed_deductions as any[])
    } else {
      setErrorAI(true)
    }
    setLoadingAI(false)
  }

  useEffect(() => {
    const demo = sessionStorage.getItem('demo_scenario')
    if (demo) {
      try {
        const parsed = JSON.parse(demo)
        if (parsed.feature === 'tax') {
          sessionStorage.removeItem('demo_scenario')
          const { feature, ...demoInputs } = parsed
          setInputs(demoInputs as TaxInputs)
          handleCalculate(demoInputs as TaxInputs)
        }
      } catch (e) {}
    }
  }, [])

  const handleChange = (field: keyof TaxInputs, value: string | boolean) => {
    setInputs((prev: TaxInputs) => ({ ...prev, [field]: typeof value === 'boolean' ? value : (Number(value) || 0) }))
  }

  const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" /> Tax Optimization Wizard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(Object.entries(inputs) as [string, any][]).map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary capitalize tracking-wide flex items-center gap-1">
                {k.replace(/_/g, ' ')}
              </label>
              {typeof v === 'boolean' ? (
                <button 
                  onClick={() => handleChange(k as keyof TaxInputs, !v)}
                  className={`w-full text-left px-3 py-2 border rounded-md text-sm transition-colors ${v ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-surface border-border'}`}
                >
                  {v ? 'Yes' : 'No'}
                </button>
              ) : (
                <input 
                  type="number"
                  value={v || ''}
                  onChange={(e) => handleChange(k as keyof TaxInputs, e.target.value)}
                  className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-surface"
                />
              )}
            </div>
          ))}
        </div>
        <button 
          onClick={() => handleCalculate()}
          className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2.5 rounded-lg flex items-center justify-center w-full sm:w-auto transition-colors"
        >
          Compare Regimes & Find Missing Tax Breaks <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {currentStep && currentStep !== 'error' && currentStep !== 'done' && (
        <AgentProgress currentStep={currentStep} />
      )}

      {result && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Old Regime Card */}
            <div className={`p-6 rounded-xl border-2 transition-all relative overflow-hidden bg-white shadow-sm ${result.recommended === 'old' ? 'border-primary ring-4 ring-primary/10' : 'border-border'}`}>
              {result.recommended === 'old' && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 pb-1.5 rounded-bl-lg flex items-center shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Best for you
                </div>
              )}
              <h3 className="text-xl font-bold mb-4">Old Regime</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="text-text-secondary flex items-center gap-1">Gross Income <Info className="w-3.5 h-3.5 opacity-50"/></span>
                  <span className="font-semibold">{inr(inputs.annual_ctc)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="text-text-secondary">Total Deductions</span>
                  <span className="font-semibold text-success">-{inr(result.total_old_deductions)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="text-text-secondary">Taxable Income</span>
                  <span className="font-semibold">{inr(result.old_taxable)}</span>
                </div>
              </div>
              <div className="bg-surface rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 border border-border">
                <span className="font-semibold text-text-primary">Final Tax</span>
                <span className="text-2xl font-bold text-danger">{inr(result.old_tax)}</span>
              </div>
              {result.recommended === 'old' && (
                <p className="text-success font-medium text-sm mt-4 text-center">
                  Saves you {inr(result.saving)} compared to the new regime!
                </p>
              )}
            </div>

            {/* New Regime Card */}
            <div className={`p-6 rounded-xl border-2 transition-all relative overflow-hidden bg-white shadow-sm ${result.recommended === 'new' ? 'border-primary ring-4 ring-primary/10' : 'border-border'}`}>
              {result.recommended === 'new' && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 pb-1.5 rounded-bl-lg flex items-center shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Best for you
                </div>
              )}
              <h3 className="text-xl font-bold mb-4">New Regime</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="text-text-secondary flex items-center gap-1">Gross Income <Info className="w-3.5 h-3.5 opacity-50"/></span>
                  <span className="font-semibold">{inr(inputs.annual_ctc)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="text-text-secondary">Standard Deduction</span>
                  <span className="font-semibold text-success">-{inr(75000)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="text-text-secondary">Taxable Income</span>
                  <span className="font-semibold">{inr(result.new_taxable - 75000)}</span>
                </div>
              </div>
              <div className="bg-surface rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 border border-border">
                <span className="font-semibold text-text-primary">Final Tax</span>
                <span className="text-2xl font-bold text-danger">{inr(result.new_tax)}</span>
              </div>
              {result.recommended === 'new' && (
                <p className="text-success font-medium text-sm mt-4 text-center">
                  Saves you {inr(result.saving)} compared to the old regime!
                </p>
              )}
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 text-sm text-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
             <div className="flex items-center gap-2 font-medium">
               <AlertTriangle className="w-4 h-4 shrink-0" />
               Breakeven point: The old regime only wins if your total deductions exceed {inr(result.breakeven_deductions)}.
             </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
             <h3 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-2">
               <TrendingUp className="w-5 h-5 text-primary" /> Missing Tax Exemptions (AI Analysis)
             </h3>

             {errorAI && (
               <div className="text-amber-800 text-sm font-medium">AI analysis currently unavailable.</div>
             )}

             {loadingAI && !errorAI && (
               <div className="space-y-3">
                 {[1, 2].map(i => (
                   <div key={i} className="animate-pulse bg-surface border border-border rounded-lg p-5 h-20 text-sm font-medium text-text-secondary flex items-center">
                     Scanning your profile for hidden tax breaks...
                   </div>
                 ))}
               </div>
             )}

             {!loadingAI && missedDeductions.length === 0 && !errorAI && (
               <div className="bg-success/5 text-success border border-success/20 p-4 rounded-lg text-sm font-medium flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5" /> You are fully maximizing all common tax benefits!
               </div>
             )}

             {!loadingAI && missedDeductions.map((m: any, i: number) => (
               <div key={i} className="bg-surface rounded-lg border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-primary/50">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-md tracking-wider">SEC {m.section}</span>
                     <h4 className="font-bold text-text-primary">{m.name}</h4>
                   </div>
                   <p className="text-sm text-text-secondary">You are leaving a gap of {inr(m.gap)} unutilised.</p>
                   <p className="text-xs text-text-secondary mt-1 max-w-lg">{m.action}</p>
                 </div>
                 <div className="px-4 py-2 bg-success/10 text-success rounded-lg border border-success/20 text-center shrink-0">
                   <div className="text-xs font-medium uppercase tracking-wider mb-0.5 opacity-80">Potential Saving</div>
                   <div className="font-bold text-lg">{inr(m.tax_saving_at_30_pct)}</div>
                 </div>
               </div>
             ))}

             {!loadingAI && missedDeductions.length > 0 && (
               <div className="mt-6 border border-primary/20 bg-primary/5 rounded-lg p-5 flex items-start gap-4 shadow-inner">
                 <TrendingUp className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-bold text-primary mb-1 uppercase tracking-wide">Future Impact of Action</h4>
                   <p className="text-sm text-text-secondary leading-relaxed">
                     At your income, acting on these deductions saves <span className="font-bold text-text-primary">{inr(missedDeductions.reduce((a,b)=>a+(b.tax_saving_at_30_pct||0), 0))}</span> this year.
                     Invested at 12% over 25 years, that becomes <span className="font-bold text-success">{inr(Math.round(missedDeductions.reduce((a,b)=>a+(b.tax_saving_at_30_pct||0), 0) * Math.pow(1.12, 25)))}</span>.
                   </p>
                 </div>
               </div>
             )}
          </div>

        </div>
      )}
    </div>
  )
}
