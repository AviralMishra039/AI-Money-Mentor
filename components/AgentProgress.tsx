'use client'
import { AgentStep } from '@/lib/orchestrator'
import { CheckCircle2, Loader2, ShieldCheck, Cpu, Brain, BarChart3, FileSearch } from 'lucide-react'

const STEPS: { key: AgentStep; label: string; description: string; icon: typeof Cpu }[] = [
  { key: 'validating',  label: 'Validator Agent',      description: 'Checking inputs for anomalies',  icon: ShieldCheck },
  { key: 'calculating', label: 'Calculator Agent',     description: 'Running financial calculations', icon: BarChart3 },
  { key: 'analyzing',   label: 'Routing Agent',        description: 'Selecting optimal AI model',     icon: FileSearch },
  { key: 'generating',  label: 'Insight Generator',    description: 'Generating personalised advice',icon: Brain },
  { key: 'guardrail',   label: 'Compliance Guardrail', description: 'Checking regulatory language',   icon: ShieldCheck },
]

interface Props {
  currentStep: AgentStep
}

export function AgentProgress({ currentStep }: Props) {
  if (currentStep === 'done' || currentStep === 'error' as any) return null;

  const currentIndex = STEPS.findIndex(s => s.key === currentStep)

  return (
    <div className="et-panel p-5 my-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-5">
        <Cpu className="w-4 h-4 text-primary" />
        <p className="text-[11px] text-text-tertiary uppercase tracking-[0.12em] font-bold">
          Agent Pipeline
        </p>
        <div className="flex-1 h-[1px] bg-border ml-2" />
        <span className="text-[10px] text-primary font-bold et-badge bg-primary/8 border border-primary/15">
          LIVE
        </span>
      </div>
      <div className="space-y-0">
        {STEPS.map((step, i) => {
          const isDone = currentIndex > i
          const isActive = currentIndex === i
          const StepIcon = step.icon
          return (
            <div key={step.key} className="flex items-start gap-4 relative">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div 
                  className={`absolute left-[15px] top-[32px] w-[1px] h-[calc(100%-8px)] transition-colors duration-500
                    ${isDone ? 'bg-success' : 'bg-border'}`} 
                />
              )}
              
              <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 relative z-10
                ${isDone ? 'bg-success text-white' : ''}
                ${isActive ? 'bg-primary text-white shadow-[0_0_12px_rgba(237,25,59,0.3)]' : ''}
                ${!isDone && !isActive ? 'bg-surface-warm text-text-tertiary border border-border' : ''}
              `}>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <StepIcon className="w-3.5 h-3.5" />
                )}
              </div>
              
              <div className="pb-5 pt-1">
                <p className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-primary' : isDone ? 'text-navy' : 'text-text-tertiary'}`}>
                  {step.label}
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
