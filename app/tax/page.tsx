'use client'

import { useState, useEffect } from 'react'
import { TaxInputs, TaxResult, AIInsight } from '@/lib/types'
import { orchestrate, AgentStep } from '@/lib/orchestrator'
import { AgentProgress } from '@/components/AgentProgress'
import { ContextChat } from '@/components/ContextChat'
import { calcTax } from '@/lib/calculations'
import { Calculator, ArrowRight, Info, CheckCircle2, TrendingUp, AlertTriangle, Link as LinkIcon, FileText } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

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
  const [isArticlePrefilled, setIsArticlePrefilled] = useState(false)

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
    // 1. Ghost Link Check
    const urlParams = new URLSearchParams(window.location.search)
    const planB64 = urlParams.get('plan')
    if (planB64) {
      try {
        const decoded = JSON.parse(atob(planB64))
        setInputs(decoded as TaxInputs)
        handleCalculate(decoded as TaxInputs)
        return // Skip demo check if ghost link
      } catch (e) {
        console.error('Failed to parse ghost link')
      }
    }

    // 2. Article/Demo Referral Check
    const demo = sessionStorage.getItem('demo_scenario')
    if (demo) {
      try {
        const parsed = JSON.parse(demo)
        if (parsed.feature === 'tax') {
          sessionStorage.removeItem('demo_scenario')
          if (sessionStorage.getItem('article_referral')) {
            sessionStorage.removeItem('article_referral')
            setIsArticlePrefilled(true)
          }
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

  const handleSliderChange = (field: keyof TaxInputs, value: number) => {
    const newInputs = { ...inputs, [field]: value }
    setInputs(newInputs)
    if (result) {
      setResult(calcTax(newInputs))
    }
  }

  const handleShare = () => {
    const payload = btoa(JSON.stringify(inputs))
    const url = `${window.location.origin}${window.location.pathname}?plan=${payload}`
    navigator.clipboard.writeText(url)
    alert("Ghost link copied to clipboard! Anyone opening it will see your exact inputs and sliders without a database.")
  }

  const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

  const chartData = result ? [
    { name: 'Gross Income', amount: inputs.annual_ctc, fill: '#6b7280' },
    { name: 'Deductions', amount: result.recommended === 'old' ? result.total_old_deductions : 75000, fill: '#22c55e' },
    { name: 'Taxable', amount: result.recommended === 'old' ? result.old_taxable : (result.new_taxable - 75000), fill: '#f59e0b' },
    { name: 'Total Tax', amount: result.recommended === 'old' ? result.old_tax : result.new_tax, fill: '#ef4444' }
  ] : []

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {isArticlePrefilled && (
        <div className="bg-primary/10 border border-primary/20 text-text-primary px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm border-l-4 border-l-primary print:hidden">
           <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-sm mr-2">INFO</span>
           <span className="font-semibold text-text-primary">We've prefilled your details based on your reading context from The Economic Times.</span>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-border shadow-sm print:hidden">
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
                  value={v === 0 ? '' : v}
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
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-1">Your Personal Tax Strategy</h2>
              <p className="text-text-secondary text-sm print:hidden">Review your calculation below, adjust sliders in real-time or ask the Mentor.</p>
            </div>
            <div className="flex gap-3 print:hidden">
              <button onClick={handleShare} className="px-4 py-2 border border-border bg-surface hover:bg-white text-text-primary rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                 <LinkIcon className="w-4 h-4" /> Share Ghost Link
              </button>
              <button onClick={() => window.print()} className="px-4 py-2 bg-black hover:bg-black/80 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors">
                 <FileText className="w-4 h-4" /> PDF Report
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4 print:hidden">
                   <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                      What-If Scenarios (Real-Time JS Engine)
                   </h3>
                   <div className="grid sm:grid-cols-3 gap-8">
                      <div>
                         <label className="flex justify-between text-sm font-bold mb-3 uppercase tracking-wider text-text-secondary text-xs">
                           <span>Section 80C</span>
                           <span className="text-primary">{inr(inputs.investments_80c)}</span>
                         </label>
                         <input type="range" min="0" max="150000" step="5000" value={inputs.investments_80c} onChange={(e) => handleSliderChange('investments_80c', Number(e.target.value))} className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div>
                         <label className="flex justify-between text-sm font-bold mb-3 uppercase tracking-wider text-text-secondary text-xs">
                           <span>NPS 80CCD(1B)</span>
                           <span className="text-primary">{inr(inputs.nps_80ccd)}</span>
                         </label>
                         <input type="range" min="0" max="50000" step="5000" value={inputs.nps_80ccd} onChange={(e) => handleSliderChange('nps_80ccd', Number(e.target.value))} className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div>
                         <label className="flex justify-between text-sm font-bold mb-3 uppercase tracking-wider text-text-secondary text-xs">
                           <span>Health Ins. 80D</span>
                           <span className="text-primary">{inr(inputs.medical_80d)}</span>
                         </label>
                         <input type="range" min="0" max="75000" step="5000" value={inputs.medical_80d} onChange={(e) => handleSliderChange('medical_80d', Number(e.target.value))} className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                   </div>
                </div>

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

                <div className="bg-white rounded-xl border border-border shadow-sm p-6 print:block">
                  <h3 className="text-lg font-bold mb-6">Financial Waterfall Flow</h3>
                  <div className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                         <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#6b7280', fontSize: 13, fontWeight: 500}} />
                         <YAxis hide />
                         <Tooltip 
                           formatter={(val: any) => inr(Number(val))}
                           cursor={{fill: '#f9fafb'}}
                           contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb'}}
                         />
                         <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                           {chartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.fill} />
                           ))}
                         </Bar>
                       </BarChart>
                     </ResponsiveContainer>
                  </div>
                </div>
             </div>
             
             <div className="space-y-6">
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 text-sm text-amber-800 flex flex-col sm:flex-row items-start justify-between gap-3 shadow-sm">
                   <div className="flex items-center gap-2 font-medium">
                     <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                     <span>Breakeven point: The old regime only wins if your total deductions exceed <strong>{inr(result.breakeven_deductions)}</strong>.</span>
                   </div>
                </div>

                <div className="bg-white rounded-xl border border-border shadow-sm p-6">
                   <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-4">
                     <TrendingUp className="w-5 h-5 text-primary" /> AI Tax Exemptions Plan
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

                   {!loadingAI && missedDeductions.length > 0 && (
                     <div className="space-y-4">
                       {missedDeductions.map((m: any, i: number) => (
                         <div key={i} className="bg-surface rounded-lg border border-border p-4 transition-all hover:border-primary/50">
                           <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                               <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-sm tracking-wider">SEC {m.section}</span>
                               <h4 className="font-bold text-text-primary text-sm">{m.name}</h4>
                             </div>
                             <div className="font-bold text-success text-sm">{inr(m.tax_saving_at_30_pct)} <span className="text-[10px] text-text-secondary font-medium">SAVED</span></div>
                           </div>
                           <p className="text-xs text-text-secondary leading-relaxed">{m.action}</p>
                         </div>
                       ))}

                       <div className="mt-4 border border-primary/20 bg-primary/5 rounded-lg p-4 flex items-start gap-3 shadow-inner">
                         <div className="pt-0.5">
                           <TrendingUp className="w-5 h-5 text-primary" />
                         </div>
                         <div>
                           <h4 className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">LT Wealth Impact</h4>
                           <p className="text-xs text-text-secondary leading-relaxed">
                             Compounded at 12% over 25 years, these savings generate <span className="font-bold text-success">{inr(Math.round(missedDeductions.reduce((a,b)=>a+(b.tax_saving_at_30_pct||0), 0) * Math.pow(1.12, 25)))}</span> in extra wealth.
                           </p>
                         </div>
                       </div>
                     </div>
                   )}
                </div>
             </div>
          </div>

          {!loadingAI && (
            <ContextChat contextData={{ inputs, calculations: result, aiAnalysis: missedDeductions }} />
          )}

        </div>
      )}
    </div>
  )
}
