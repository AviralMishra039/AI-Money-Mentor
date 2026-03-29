import { AIInsight } from '@/lib/types'
import { AlertTriangle, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

export function InsightCard({ insight }: { insight: AIInsight }) {
  const config: Record<string, { border: string; badge: string; badgeText: string; icon: typeof AlertTriangle }> = {
    critical: { 
      border: 'border-l-danger', 
      badge: 'bg-danger/10 text-danger border-danger/20', 
      badgeText: 'Urgent',
      icon: AlertTriangle 
    },
    warning: { 
      border: 'border-l-warning', 
      badge: 'bg-warning/10 text-warning border-warning/20', 
      badgeText: 'Attention',
      icon: AlertCircle 
    },
    good: { 
      border: 'border-l-success', 
      badge: 'bg-success/10 text-success border-success/20', 
      badgeText: 'On Track',
      icon: CheckCircle2 
    },
  }

  const c = config[insight.severity] || config.warning
  const Icon = c.icon

  return (
    <div className={`et-panel p-0 border-l-[3px] ${c.border} overflow-hidden group hover:shadow-md transition-all duration-300`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <Icon className="w-4 h-4 shrink-0 opacity-70" style={{ color: insight.severity === 'critical' ? '#dc2626' : insight.severity === 'good' ? '#16a34a' : '#d97706' }} />
            <h4 className="font-serif font-bold text-navy text-base leading-snug">{insight.title}</h4>
          </div>
          <span className={`et-badge border shrink-0 ${c.badge}`}>
            {c.badgeText}
          </span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-4 pl-[26px]">
          {insight.description}
        </p>
      </div>
      
      <div className="bg-surface-warm/50 border-t border-border px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="font-medium text-text-primary">{insight.specific_action}</span>
        </div>
        {insight.estimated_benefit_inr && (
          <div className="text-sm font-bold text-success whitespace-nowrap et-badge bg-success/8 border border-success/15">
            +₹{insight.estimated_benefit_inr.toLocaleString('en-IN')}
          </div>
        )}
      </div>
    </div>
  )
}
