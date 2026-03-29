'use client'

import { useState, useEffect } from 'react'
import { TaxInputs, TaxResult, AIInsight } from '@/lib/types'
import { orchestrate, AgentStep } from '@/lib/orchestrator'
import { AgentProgress } from '@/components/AgentProgress'
import { ContextChat } from '@/components/ContextChat'
import { calcTax } from '@/lib/calculations'
import { Calculator, ArrowRight, CheckCircle2, TrendingUp, AlertTriangle, Link as LinkIcon, FileText, IndianRupee, Sparkles } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const labelNames: Record<keyof TaxInputs, string> = {
  annual_ctc: 'Annual CTC (₹)',
  hra_received: 'HRA received per year (₹)',
  rent_paid: 'Annual rent paid (₹)',
  is_metro: 'Metro city residence?',
  investments_80c: '80C investments (₹)',
  nps_80ccd: 'NPS contribution (₹)',
  home_loan_interest: 'Home loan interest (₹)',
  medical_80d: 'Medical insurance 80D (₹)'
}

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
    const urlParams = new URLSearchParams(window.location.search)
    const planB64 = urlParams.get('plan')
    if (planB64) {
      try {
        const decoded = JSON.parse(atob(planB64))
        setInputs(decoded as TaxInputs)
        handleCalculate(decoded as TaxInputs)
        return
      } catch (e) {
        console.error('Failed to parse ghost link')
      }
    }

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

  // Waterfall chart builder (from incoming branch — more informative than simple bar chart)
  const buildWaterfall = () => {
    if (!result) return []
    const top = inputs.annual_ctc
    const arr: any[] = []

    arr.push({ name: 'Gross CTC', amount: top, fill: '#1a1a2e' })
    let floor = top

    if (result.recommended === 'old') {
      const st = 50000
      const s80c = Math.min(inputs.investments_80c, 150000)
      const ccd = Math.min(inputs.nps_80ccd, 50000)
      const hra = Math.min((result as any).hra_exemption ?? 0, inputs.hra_received)
      const other = result.total_old_deductions - (st + s80c + ccd + hra)

      const addStep = (label: string, amt: number) => {
        if (amt > 0) {
          floor = Math.max(0, floor - amt)
        }
      }
      addStep('Std Deduct', st)
      addStep('80C', s80c)
      addStep('80CCD', ccd)
      addStep('HRA', hra)
      addStep('Other Ded.', other > 0 ? other : 0)

      arr.push({ name: 'Deductions', amount: result.total_old_deductions, fill: '#16a34a' })
      arr.push({ name: 'Taxable', amount: floor, fill: '#d97706' })
      arr.push({ name: 'Tax Due', amount: result.old_tax, fill: '#dc2626' })
    } else {
      const st = 75000
      floor = Math.max(0, floor - st)
      arr.push({ name: 'Std Deduct', amount: st, fill: '#16a34a' })
      arr.push({ name: 'Taxable', amount: floor, fill: '#d97706' })
      arr.push({ name: 'Tax Due', amount: result.new_tax, fill: '#dc2626' })
    }
    return arr
  }

  const chartData = buildWaterfall()

  return (
    <div className="space-y-8 et-fade-in">
      
      {isArticlePrefilled && (
        <div className="et-panel p-4 border-l-[3px] border-l-primary flex items-center gap-3">
          <span className="et-badge bg-primary text-white">Info</span>
          <span className="text-sm font-medium text-navy">
            We&apos;ve prefilled your details based on your reading context from The Economic Times.
          </span>
        </div>
      )}

      {/* Input Form */}
      <div className="et-panel p-8 print:hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded bg-warning/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-2xl text-navy">Tax Optimization Wizard</h2>
            <p className="text-xs text-text-tertiary mt-0.5">FY2025-26 &middot; Compare regimes &middot; Find hidden deductions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {(Object.entries(inputs) as [string, any][]).map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1.5">
              <label className="et-label">
                {labelNames[k as keyof TaxInputs]}
              </label>
              {typeof v === 'boolean' ? (
                <button 
                  onClick={() => handleChange(k as keyof TaxInputs, !v)}
                  className={`et-input text-left transition-colors font-medium ${
                    v ? '!border-primary !bg-primary/5 text-primary' : ''
                  }`}
                >
                  {v ? '✓ Yes' : 'No'}
                </button>
              ) : (
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                  <input 
                    type="number"
                    value={v === 0 ? '' : v}
                    onChange={(e) => handleChange(k as keyof TaxInputs, e.target.value)}
                    className="et-input !pl-8"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => handleCalculate()}
          className="et-btn-primary w-full sm:w-auto"
        >
          Compare Regimes & Find Missing Tax Breaks <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {currentStep && currentStep !== 'error' && currentStep !== 'done' && (
        <AgentProgress currentStep={currentStep} />
      )}

      {result && (
        <div className="space-y-8 et-slide-up">
          
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border">
            <div>
              <h2 className="font-serif font-black text-3xl text-navy tracking-tight mb-1">Your Personal Tax Strategy</h2>
              <p className="text-text-tertiary text-sm print:hidden">Adjust sliders in real-time or ask the AI Mentor.</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button onClick={handleShare} className="et-badge bg-surface-warm text-navy border border-border px-3 py-2 cursor-pointer hover:bg-white transition-colors flex items-center gap-1.5 text-xs font-bold">
                <LinkIcon className="w-3.5 h-3.5" /> Share Link
              </button>
              <button onClick={() => window.print()} className="et-badge bg-navy text-white px-3 py-2 cursor-pointer hover:bg-primary transition-colors flex items-center gap-1.5 text-xs font-bold">
                <FileText className="w-3.5 h-3.5" /> PDF Report
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* What-If Sliders */}
              <div className="et-panel p-6 print:hidden">
                <h3 className="et-section-header text-lg">What-If Scenarios</h3>
                <div className="grid sm:grid-cols-3 gap-8">
                  {[
                    { key: 'investments_80c' as keyof TaxInputs, label: 'Section 80C', max: 150000 },
                    { key: 'nps_80ccd' as keyof TaxInputs, label: 'NPS 80CCD(1B)', max: 50000 },
                    { key: 'medical_80d' as keyof TaxInputs, label: 'Health Ins. 80D', max: 75000 },
                  ].map(s => (
                    <div key={s.key}>
                      <label className="flex justify-between items-center mb-3">
                        <span className="et-label !mb-0">{s.label}</span>
                        <span className="text-sm font-bold text-primary">{inr(inputs[s.key] as number)}</span>
                      </label>
                      <input 
                        type="range" min="0" max={s.max} step="5000" 
                        value={inputs[s.key] as number} 
                        onChange={(e) => handleSliderChange(s.key, Number(e.target.value))} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Regime Comparison */}
              <div className="grid md:grid-cols-2 gap-0">
                {/* Old Regime */}
                <div className={`et-panel p-6 relative overflow-hidden ${result.recommended === 'old' ? '!border-primary ring-2 ring-primary/10' : ''}`}>
                  {result.recommended === 'old' && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Best for you
                    </div>
                  )}
                  <h3 className="font-serif font-bold text-xl text-navy mb-5">Old Regime</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center text-sm border-b border-border-light pb-2.5">
                      <span className="text-text-tertiary">Gross Income</span>
                      <span className="font-semibold text-navy">{inr(inputs.annual_ctc)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-border-light pb-2.5">
                      <span className="text-text-tertiary">Total Deductions</span>
                      <span className="font-bold text-success">-{inr(result.total_old_deductions)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-border-light pb-2.5">
                      <span className="text-text-tertiary">Taxable Income</span>
                      <span className="font-semibold text-navy">{inr(result.old_taxable)}</span>
                    </div>
                  </div>
                  <div className="bg-surface-warm rounded p-4 flex justify-between items-center border border-border">
                    <span className="font-semibold text-navy text-sm">Final Tax</span>
                    <span className="text-2xl font-serif font-black text-danger">{inr(result.old_tax)}</span>
                  </div>
                  {result.recommended === 'old' && (
                    <p className="text-success font-semibold text-sm mt-4 text-center flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Saves you {inr(result.saving)}!
                    </p>
                  )}
                </div>

                {/* New Regime */}
                <div className={`et-panel p-6 relative overflow-hidden ${result.recommended === 'new' ? '!border-primary ring-2 ring-primary/10' : ''}`}>
                  {result.recommended === 'new' && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Best for you
                    </div>
                  )}
                  <h3 className="font-serif font-bold text-xl text-navy mb-5">New Regime</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center text-sm border-b border-border-light pb-2.5">
                      <span className="text-text-tertiary">Gross Income</span>
                      <span className="font-semibold text-navy">{inr(inputs.annual_ctc)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-border-light pb-2.5">
                      <span className="text-text-tertiary">Standard Deduction</span>
                      <span className="font-bold text-success">-{inr(75000)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-border-light pb-2.5">
                      <span className="text-text-tertiary">Taxable Income</span>
                      <span className="font-semibold text-navy">{inr(result.new_taxable - 75000)}</span>
                    </div>
                  </div>
                  <div className="bg-surface-warm rounded p-4 flex justify-between items-center border border-border">
                    <span className="font-semibold text-navy text-sm">Final Tax</span>
                    <span className="text-2xl font-serif font-black text-danger">{inr(result.new_tax)}</span>
                  </div>
                  {result.recommended === 'new' && (
                    <p className="text-success font-semibold text-sm mt-4 text-center flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Saves you {inr(result.saving)}!
                    </p>
                  )}
                </div>
              </div>

              {/* Chart */}
              <div className="et-panel p-6">
                <h3 className="et-section-header text-lg">Financial Waterfall</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#5c5470', fontSize: 12, fontWeight: 600}} />
                      <YAxis hide />
                      <Tooltip 
                        formatter={(val: any) => inr(Number(val))}
                        cursor={{fill: '#faf8f5'}}
                        contentStyle={{borderRadius: '2px', border: '1px solid #e8e0d8', fontFamily: 'Inter', fontSize: '13px'}}
                      />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Breakeven */}
              <div className="et-panel p-4 border-l-[3px] border-l-warning">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <p className="text-sm text-text-secondary leading-relaxed">
                    <span className="font-bold text-navy">Breakeven Point:</span> The old regime only wins if deductions exceed <strong className="text-primary">{inr(result.breakeven_deductions)}</strong>.
                  </p>
                </div>
              </div>

              {/* AI Tax Plan */}
              <div className="et-panel p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-serif font-bold text-lg text-navy">AI Tax Plan</h3>
                </div>

                {errorAI && (
                  <p className="text-sm font-medium text-warning">AI analysis currently unavailable.</p>
                )}

                {loadingAI && !errorAI && (
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="animate-pulse bg-surface-warm border border-border rounded p-5 h-20 text-sm font-medium text-text-tertiary flex items-center">
                        Scanning for hidden tax breaks...
                      </div>
                    ))}
                  </div>
                )}

                {!loadingAI && missedDeductions.length === 0 && !errorAI && (
                  <div className="bg-success/5 text-success border border-success/20 p-4 rounded text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Fully maximized!
                  </div>
                )}

                {!loadingAI && missedDeductions.length > 0 && (
                  <div className="space-y-4">
                    {missedDeductions.map((m: any, i: number) => (
                      <div key={i} className="bg-surface rounded border border-border p-4 transition-all hover:border-primary/30 group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="et-badge bg-primary/10 text-primary border border-primary/20">SEC {m.section}</span>
                            <h4 className="font-bold text-navy text-sm">{m.name}</h4>
                          </div>
                          <div className="font-bold text-success text-sm">{inr(m.tax_saving_at_30_pct)}</div>
                        </div>
                        <p className="text-xs text-text-tertiary leading-relaxed">{m.action}</p>
                      </div>
                    ))}

                    <div className="et-panel p-4 border-l-[3px] border-l-primary bg-primary/[0.02]">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="et-label text-primary !mb-1">LT Wealth Impact</h4>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            Compounded at 12% over 25 years: <span className="font-bold text-success">{inr(Math.round(missedDeductions.reduce((a,b)=>a+(b.tax_saving_at_30_pct||0), 0) * Math.pow(1.12, 25)))}</span> in extra wealth.
                          </p>
                        </div>
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
