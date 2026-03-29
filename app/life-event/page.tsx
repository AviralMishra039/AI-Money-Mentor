'use client'

import { useState } from 'react'
import { LifeInputs } from '@/lib/types'
import { calcLifeAllocation } from '@/lib/calculations'
import { Briefcase, Baby, Heart, Coins, ArrowRight, AlertOctagon, TrendingUp, CheckCircle2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const EVENTS = [
  { id: 'bonus', label: 'Year-end Bonus', icon: TrendingUp },
  { id: 'new_baby', label: 'New Baby', icon: Baby },
  { id: 'marriage', label: 'Getting Married', icon: Heart },
  { id: 'inheritance', label: 'Inheritance', icon: Coins }
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

  const handleEventSelect = (type: string) => {
    setInputs({ ...inputs, event_type: type as any })
    setStep(2)
  }

  const handleCalculate = async () => {
    const calc = calcLifeAllocation(inputs)
    setAllocations(calc)
    setStep(3)
    setAiAnalysis(null)
    setLoadingAI(true)
    setErrorAI(false)

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: 'life_event', inputs, calculated_data: calc })
      })
      const data = await res.json()
      if (data.success && data.data) {
        setAiAnalysis(data.data)
      } else {
        setErrorAI(true)
      }
    } catch {
      setErrorAI(true)
    } finally {
      setLoadingAI(false)
    }
  }

  const COLORS = ['#1a56db', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444']
  const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {step === 1 && (
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm text-center py-12">
          <h2 className="text-2xl font-bold mb-8">What are you planning for?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {EVENTS.map(e => (
              <button 
                key={e.id}
                onClick={() => handleEventSelect(e.id)}
                className="flex flex-col items-center justify-center gap-4 p-8 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-text-primary group"
              >
                <div className="w-16 h-16 rounded-full bg-surface text-text-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <e.icon className="w-8 h-8" />
                </div>
                <span className="font-semibold text-lg">{e.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm max-w-2xl mx-auto animate-in slide-in-from-right-8 duration-500">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-primary/10 text-primary p-2 rounded-lg">
              {EVENTS.find(e => e.id === inputs.event_type)?.icon && 
               (() => { const Icon = EVENTS.find(e => e.id === inputs.event_type)!.icon; return <Icon className="w-5 h-5"/> })()}
            </span>
            {EVENTS.find(e => e.id === inputs.event_type)?.label} Details
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1">Event Windfall / Amount</label>
              <input type="number" 
                value={inputs.event_amount} 
                onChange={(e) => setInputs({...inputs, event_amount: Number(e.target.value) || 0})}
                className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-surface"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1">Age</label>
                <input type="number" 
                  value={inputs.age} 
                  onChange={(e) => setInputs({...inputs, age: Number(e.target.value) || 0})}
                  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary/20 bg-surface text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1">Monthly Income</label>
                <input type="number" 
                  value={inputs.monthly_income} 
                  onChange={(e) => setInputs({...inputs, monthly_income: Number(e.target.value) || 0})}
                  className="w-full p-3 border border-border rounded-md focus:ring-2 focus:ring-primary/20 bg-surface text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Tax Bracket</label>
              <div className="flex gap-4">
                {[10, 20, 30].map(val => (
                  <label key={val} className="flex-1">
                    <input type="radio" name="tax" checked={inputs.tax_bracket === val} onChange={() => setInputs({...inputs, tax_bracket: val as any})} className="sr-only peer"/>
                    <div className="text-center p-3 border rounded-md cursor-pointer peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary font-medium text-sm transition-all focus:ring-2 focus:ring-primary/20 bg-surface border-border hover:bg-surface/80">
                      {val}%
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Risk Appetite</label>
              <div className="flex gap-4">
                {['conservative', 'moderate', 'aggressive'].map(val => (
                  <label key={val} className="flex-1">
                    <input type="radio" name="risk" checked={inputs.risk_profile === val} onChange={() => setInputs({...inputs, risk_profile: val as any})} className="sr-only peer"/>
                    <div className="text-center p-3 border rounded-md cursor-pointer peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary font-medium text-sm capitalize transition-all focus:ring-2 bg-surface text-text-primary hover:bg-surface/80">
                      {val}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {inputs.event_type === 'bonus' && (
              <div className="bg-amber-50 rounded-lg p-5 border border-amber-200 mt-6 space-y-4 shadow-sm">
                <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                   <AlertOctagon className="w-4 h-4"/> Debt Check
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-800 mb-1">Total Loan Amount</label>
                    <input type="number" 
                      value={inputs.existing_debt} 
                      onChange={(e) => setInputs({...inputs, existing_debt: Number(e.target.value) || 0})}
                      className="w-full p-2.5 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-800 mb-1">Interest Rate (%)</label>
                    <input type="number" 
                      value={inputs.debt_interest_rate} 
                      onChange={(e) => setInputs({...inputs, debt_interest_rate: Number(e.target.value) || 0})}
                      className="w-full p-2.5 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500/20 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8 pt-6 border-t border-border">
              <button onClick={() => setStep(1)} className="px-6 py-3 font-medium text-text-secondary hover:text-text-primary transition-colors flex-1 text-center bg-surface border border-border rounded-lg">Back</button>
              <button onClick={handleCalculate} className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg flex items-center justify-center gap-2 flex-[2] transition-colors">
                Generate Secure Plan <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && allocations.length > 0 && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          
          {aiAnalysis?.edge_case_note && (
             <div className="bg-danger/10 text-danger border border-danger/20 rounded-xl p-5 shadow-sm flex items-start sm:items-center gap-4">
                <AlertOctagon className="w-8 h-8 shrink-0"/>
                <div className="text-sm font-semibold leading-relaxed">
                   {aiAnalysis.edge_case_note}
                </div>
             </div>
          )}

          <div className="bg-white rounded-xl border border-border shadow-sm p-6 lg:p-10">
            <h2 className="text-2xl font-bold mb-2">Your Recommended Allocation</h2>
            <p className="text-text-secondary mb-10 pb-6 border-b border-border">
              {aiAnalysis?.one_line_summary || "Here is how you should deploy your windfall."}
            </p>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="h-[280px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart layout="vertical" data={allocations} margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                     <XAxis type="number" hide />
                     <YAxis dataKey="label" type="category" width={140} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 13, fontWeight: 500}} />
                     <Tooltip 
                       formatter={(val: any) => [`${val}%`, 'Allocation']} 
                       cursor={{fill: '#f9fafb'}}
                       contentStyle={{borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                     />
                     <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                       {allocations.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                 {allocations.map((a: any, i: number) => (
                   <div key={i} className="flex gap-4 p-4 border border-border rounded-lg bg-surface relative overflow-hidden group hover:border-text-primary transition-colors">
                     <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                     <div className="w-16 shrink-0 pt-0.5">
                       <span className="text-xl font-bold block leading-none">{a.percentage}%</span>
                       <span className="text-xs text-text-secondary font-medium tracking-wide">SHARE</span>
                     </div>
                     <div>
                       <h4 className="font-bold text-text-primary mb-0.5">{a.label}</h4>
                       <span className="block text-success font-medium text-sm mb-1">{inr(a.amount)}</span>
                       <p className="text-xs text-text-secondary leading-snug">{a.rationale}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-white border border-border rounded-xl p-6 lg:p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary"/> Immediate Actions (AI Timeline)
                </h3>
                
                {errorAI && (
                   <div className="text-sm font-medium text-amber-800">Timeline unavailable. Proceed with common lifecycle allocations.</div>
                )}
                {loadingAI && !errorAI && (
                  <div className="animate-pulse flex items-center justify-center p-12 text-text-secondary font-medium">Generating timeline...</div>
                )}

                {!loadingAI && aiAnalysis?.immediate_actions?.map((act: any, i: number) => (
                   <div key={i} className="flex gap-6 mb-6 last:mb-0 group">
                      <div className="flex flex-col items-center">
                         <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20" />
                         {i !== aiAnalysis.immediate_actions.length - 1 && <div className="w-px h-full bg-border mt-2 group-hover:bg-primary/50 transition-colors" />}
                      </div>
                      <div className="pb-2">
                         <div className="text-xs font-bold text-primary tracking-wider uppercase mb-1">{act.deadline}</div>
                         <h4 className="text-lg font-bold text-text-primary mb-1">{act.action}</h4>
                         <p className="text-sm text-text-secondary">{act.reason}</p>
                      </div>
                   </div>
                ))}
             </div>
             
             <div className="space-y-6">
                <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <Heart className="w-5 h-5 text-danger"/> Insurance Flags
                   </h3>
                   {!loadingAI && aiAnalysis?.insurance_flags?.map((flag: any, i: number) => (
                      <div key={i} className="mb-4 last:mb-0 p-3 bg-danger/5 rounded-lg border border-danger/10">
                        <span className="inline-block px-2 py-0.5 bg-danger/10 text-danger text-xs font-bold rounded capitalize tracking-wider mb-2">{flag.urgency}</span>
                        <div className="text-sm font-medium text-text-primary">{flag.type}</div>
                        <div className="text-xs text-text-secondary">Expected gap: {flag.gap}</div>
                      </div>
                   ))}
                   {loadingAI && <div className="h-10 bg-surface animate-pulse rounded-md" />}
                </div>

                <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <Coins className="w-5 h-5 text-amber-500"/> Tax Implications
                   </h3>
                   <div className="text-sm text-text-secondary leading-relaxed p-4 bg-surface rounded-lg border border-border">
                      {loadingAI ? 'Calculating tax...' : (aiAnalysis?.tax_implications || "No immediate tax implications detected for this event.")}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
