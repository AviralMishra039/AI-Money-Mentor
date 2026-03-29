'use client'

import { useState } from 'react'
import { LifeInputs } from '@/lib/types'
import { orchestrate, AgentStep } from '@/lib/orchestrator'
import { AgentProgress } from '@/components/AgentProgress'
import { Briefcase, Baby, Heart, Coins, ArrowRight, AlertOctagon, TrendingUp, CheckCircle2, IndianRupee, Sparkles } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const EVENTS = [
  { id: 'bonus', label: 'Year-end Bonus', desc: 'Deploy your windfall strategically', icon: TrendingUp, color: '#16a34a' },
  { id: 'new_baby', label: 'New Baby', desc: 'Secure your family\'s future', icon: Baby, color: '#7c3aed' },
  { id: 'marriage', label: 'Getting Married', desc: 'Plan your joint financial life', icon: Heart, color: '#dc2626' },
  { id: 'inheritance', label: 'Inheritance', desc: 'Maximize legacy wealth', icon: Coins, color: '#d97706' },
] as const

export default function LifeEventPage() {
  const [step, setStep] = useState(1)
  const [inputs, setInputs] = useState<LifeInputs>({
    event_type: 'bonus',
    event_amount: 500000,
    age: 30,
    monthly_income: 100000,
    tax_bracket: 30,
    risk_profile: 'moderate',
    existing_debt: 800000,
    debt_interest_rate: 14
  })

  const [allocations, setAllocations] = useState<any[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [errorAI, setErrorAI] = useState(false)
  const [currentStep, setCurrentStep] = useState<AgentStep | null>(null)

  const handleEventSelect = (type: string) => {
    setInputs({ ...inputs, event_type: type as any })
    setStep(2)
  }

  const handleCalculate = async () => {
    setAllocations([])
    setStep(3)
    setAiAnalysis(null)
    setLoadingAI(true)
    setErrorAI(false)
    setCurrentStep('validating')

    const res = await orchestrate('life_event', inputs as any, (step) => {
      setCurrentStep(step)
    })

    if (!res.success) {
      setErrorAI(true)
      setLoadingAI(false)
      setCurrentStep('error')
      alert('Validation Error: ' + res.error)
      return
    }

    setAllocations(res.calculated_data as any)
    
    if (res.ai_output && (res.ai_output.one_line_summary || res.ai_output.immediate_actions)) {
      setAiAnalysis(res.ai_output)
    } else {
      setErrorAI(true)
    }
    setLoadingAI(false)
  }

  const COLORS = ['#1a1a2e', '#16a34a', '#d97706', '#7c3aed', '#dc2626']
  const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

  const selectedEvent = EVENTS.find(e => e.id === inputs.event_type)

  return (
    <div className="space-y-8 et-fade-in">
      
      {/* Step 1: Event Selection */}
      {step === 1 && (
        <div className="et-panel py-16 px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif font-black text-3xl text-navy mb-3">What&apos;s happening in your life?</h2>
            <p className="text-text-tertiary text-sm">Select an event and we&apos;ll build you a personalised financial action plan.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 max-w-4xl mx-auto et-stagger">
            {EVENTS.map((e, i) => (
              <button 
                key={e.id}
                onClick={() => handleEventSelect(e.id)}
                className={`flex flex-col items-center justify-center gap-4 p-8 border border-border bg-white hover:bg-surface transition-all duration-300 text-navy group ${i < EVENTS.length - 1 ? 'et-col-rule' : ''}`}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ backgroundColor: `${e.color}10`, color: e.color }}
                >
                  <e.icon className="w-7 h-7" />
                </div>
                <div className="text-center">
                  <span className="font-serif font-bold text-lg block mb-1">{e.label}</span>
                  <span className="text-xs text-text-tertiary">{e.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Input Details */}
      {step === 2 && (
        <div className="et-panel p-8 max-w-2xl mx-auto et-slide-up">
          <div className="flex items-center gap-3 mb-8">
            <div 
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ backgroundColor: `${selectedEvent?.color}10`, color: selectedEvent?.color }}
            >
              {selectedEvent && <selectedEvent.icon className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-navy">{selectedEvent?.label} Details</h2>
              <p className="text-xs text-text-tertiary mt-0.5">Fill in your financial context below</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="et-label">Event Windfall / Amount</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                <input type="number" 
                  value={inputs.event_amount} 
                  onChange={(e) => setInputs({...inputs, event_amount: Number(e.target.value) || 0})}
                  className="et-input !pl-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="et-label">Age</label>
                <input type="number" 
                  value={inputs.age} 
                  onChange={(e) => setInputs({...inputs, age: Number(e.target.value) || 0})}
                  className="et-input"
                />
              </div>
              <div>
                <label className="et-label">Monthly Income</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                  <input type="number" 
                    value={inputs.monthly_income} 
                    onChange={(e) => setInputs({...inputs, monthly_income: Number(e.target.value) || 0})}
                    className="et-input !pl-8"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="et-label">Tax Bracket</label>
              <div className="flex gap-3">
                {[10, 20, 30].map(val => (
                  <label key={val} className="flex-1">
                    <input type="radio" name="tax" checked={inputs.tax_bracket === val} onChange={() => setInputs({...inputs, tax_bracket: val as any})} className="sr-only peer"/>
                    <div className="text-center py-3 border border-border bg-white cursor-pointer peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary font-bold text-sm transition-all rounded-sm hover:bg-surface">
                      {val}%
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="et-label">Risk Appetite</label>
              <div className="flex gap-3">
                {['conservative', 'moderate', 'aggressive'].map(val => (
                  <label key={val} className="flex-1">
                    <input type="radio" name="risk" checked={inputs.risk_profile === val} onChange={() => setInputs({...inputs, risk_profile: val as any})} className="sr-only peer"/>
                    <div className="text-center py-3 border border-border bg-white cursor-pointer peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary font-bold text-sm capitalize transition-all rounded-sm hover:bg-surface">
                      {val}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {inputs.event_type === 'bonus' && (
              <div className="et-panel p-5 border-l-[3px] border-l-warning bg-warning/[0.02] space-y-4">
                <h4 className="text-sm font-bold text-navy flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-warning"/> Debt Check
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="et-label">Total Loan Amount</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
                      <input type="number" 
                        value={inputs.existing_debt} 
                        onChange={(e) => setInputs({...inputs, existing_debt: Number(e.target.value) || 0})}
                        className="et-input !pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="et-label">Interest Rate (%)</label>
                    <input type="number" 
                      value={inputs.debt_interest_rate} 
                      onChange={(e) => setInputs({...inputs, debt_interest_rate: Number(e.target.value) || 0})}
                      className="et-input"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8 pt-6 border-t border-border">
              <button onClick={() => setStep(1)} className="et-input !w-auto !px-6 text-center font-semibold text-text-secondary hover:text-navy cursor-pointer transition-colors">
                Back
              </button>
              <button onClick={handleCalculate} className="et-btn-primary flex-1">
                Generate Secure Plan <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div className="space-y-8 et-slide-up">
          
          {currentStep && currentStep !== 'error' && currentStep !== 'done' && (
            <AgentProgress currentStep={currentStep} />
          )}

          {allocations.length > 0 && (
            <div className="space-y-8">
          
              {aiAnalysis?.edge_case_note && (
                <div className="et-panel p-5 border-l-[3px] border-l-danger flex items-start gap-4">
                  <AlertOctagon className="w-6 h-6 text-danger shrink-0 mt-0.5"/>
                  <p className="text-sm font-semibold text-navy leading-relaxed">
                    {aiAnalysis.edge_case_note}
                  </p>
                </div>
              )}

              {/* Allocation Panel */}
              <div className="et-panel overflow-hidden">
                <div className="bg-navy px-8 py-5">
                  <h2 className="font-serif font-bold text-xl text-white mb-1">Your Recommended Allocation</h2>
                  <p className="text-white/50 text-sm">
                    {aiAnalysis?.one_line_summary || "Here is how you should deploy your windfall."}
                  </p>
                </div>

                <div className="p-8">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={allocations} margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="label" type="category" width={140} axisLine={false} tickLine={false} tick={{fill: '#5c5470', fontSize: 12, fontWeight: 600}} />
                          <Tooltip 
                            formatter={(val: any) => [`${val}%`, 'Allocation']} 
                            cursor={{fill: '#faf8f5'}}
                            contentStyle={{borderRadius: '2px', border: '1px solid #e8e0d8', fontFamily: 'Inter'}}
                          />
                          <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                            {allocations.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-3">
                      {allocations.map((a: any, i: number) => (
                        <div key={i} className="flex gap-4 p-4 border border-border rounded-sm bg-white relative overflow-hidden group hover:border-navy/30 transition-all">
                          <div className="absolute left-0 top-0 bottom-0 w-1" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                          <div className="w-14 shrink-0 pl-2">
                            <span className="text-xl font-serif font-black text-navy block leading-none">{a.percentage}%</span>
                            <span className="text-[9px] text-text-tertiary font-bold tracking-[0.15em] uppercase">share</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-navy text-sm mb-0.5">{a.label}</h4>
                            <span className="block text-success font-bold text-sm mb-1">{inr(a.amount)}</span>
                            <p className="text-[11px] text-text-tertiary leading-snug">{a.rationale}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Future Impact */}
                  {!loadingAI && (
                    <div className="mt-8 et-panel p-5 border-l-[3px] border-l-success bg-success/[0.02]">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <div>
                          <h4 className="et-label text-success !mb-1">Future Impact of Action</h4>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            Your <span className="font-bold text-navy">{inr(inputs.event_amount)}</span> grows to <span className="font-bold text-success">{inr(Math.round(inputs.event_amount * Math.pow(1.10, 10)))}</span> in 10 years — <span className="text-success font-semibold">{inr(Math.round(inputs.event_amount * Math.pow(1.10, 10)) - Math.round(inputs.event_amount * Math.pow(1.04, 10)))} more</span> than a savings account.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline & Sidebar */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 et-panel p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-serif font-bold text-xl text-navy">AI Action Timeline</h3>
                  </div>
                  
                  {errorAI && (
                    <p className="text-sm font-medium text-warning">Timeline unavailable. Proceed with common allocations.</p>
                  )}
                  {loadingAI && !errorAI && (
                    <div className="animate-pulse flex items-center justify-center p-12 text-text-tertiary font-medium">Generating timeline...</div>
                  )}

                  {!loadingAI && aiAnalysis?.immediate_actions?.map((act: any, i: number) => (
                    <div key={i} className="flex gap-5 mb-6 last:mb-0 group">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/10" />
                        {i !== aiAnalysis.immediate_actions.length - 1 && <div className="w-px h-full bg-border mt-2 group-hover:bg-primary/30 transition-colors" />}
                      </div>
                      <div className="pb-2">
                        <div className="et-badge bg-primary/10 text-primary border border-primary/20 mb-2">{act.deadline}</div>
                        <h4 className="font-serif font-bold text-lg text-navy mb-1">{act.action}</h4>
                        <p className="text-sm text-text-tertiary">{act.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-6">
                  <div className="et-panel p-6">
                    <h3 className="et-section-header text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5 text-danger"/> Insurance Flags
                    </h3>
                    {!loadingAI && aiAnalysis?.insurance_flags?.map((flag: any, i: number) => (
                      <div key={i} className="mb-4 last:mb-0 p-3 bg-danger/[0.03] rounded border border-danger/10">
                        <span className="et-badge bg-danger/10 text-danger border border-danger/20 mb-2">{flag.urgency}</span>
                        <div className="text-sm font-semibold text-navy">{flag.type}</div>
                        <div className="text-xs text-text-tertiary mt-1">Gap: {flag.gap}</div>
                      </div>
                    ))}
                    {loadingAI && <div className="h-10 bg-surface-warm animate-pulse rounded" />}
                  </div>

                  <div className="et-panel p-6">
                    <h3 className="et-section-header text-lg flex items-center gap-2">
                      <Coins className="w-5 h-5 text-warning"/> Tax Implications
                    </h3>
                    <div className="text-sm text-text-secondary leading-relaxed p-4 bg-surface-warm rounded border border-border">
                      {loadingAI ? 'Calculating tax...' : (aiAnalysis?.tax_implications || "No immediate tax implications.")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
