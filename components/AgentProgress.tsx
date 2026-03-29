'use client'
import { AgentStep } from '@/lib/orchestrator'

const STEPS: { key: AgentStep; label: string; description: string }[] = [
  { key: 'validating',  label: 'Validator agent',          description: 'Checking inputs for errors' },
  { key: 'calculating', label: 'Calculator agent',         description: 'Running financial calculations' },
  { key: 'analyzing',   label: 'Routing agent',            description: 'Selecting optimal AI model' },
  { key: 'generating',  label: 'Insight generator',        description: 'Generating personalised advice' },
  { key: 'guardrail',   label: 'Compliance guardrail',     description: 'Checking regulatory language' },
]

interface Props {
  currentStep: AgentStep
}

export function AgentProgress({ currentStep }: Props) {
  if (currentStep === 'done' || currentStep === 'error' as any) return null;

  const currentIndex = STEPS.findIndex(s => s.key === currentStep)

  return (
    <div className="border border-border rounded-lg p-4 my-4 bg-surface shadow-sm">
      <p className="text-xs text-text-secondary mb-3 uppercase tracking-wide font-bold">
        Agent pipeline running
      </p>
      <div className="space-y-3">
        {STEPS.map((step, i) => {
          const isDone = currentIndex > i
          const isActive = currentIndex === i
          return (
             <div key={step.key} className="flex items-start gap-3">
               <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 transition-all
                 ${isDone ? 'bg-success text-white' : ''}
                 ${isActive ? 'bg-primary text-white animate-pulse' : ''}
                 ${!isDone && !isActive ? 'bg-border text-text-secondary' : ''}
               `}>
                 {isDone ? '✓' : i + 1}
               </div>
               <div>
                 <p className={`text-sm font-bold ${isActive ? 'text-primary' : isDone ? 'text-text-primary' : 'text-text-secondary'}`}>
                   {step.label}
                 </p>
                 <p className="text-xs text-text-secondary mt-0.5">{step.description}</p>
               </div>
             </div>
          )
        })}
      </div>
    </div>
  )
}
