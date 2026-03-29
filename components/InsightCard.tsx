import { AIInsight } from '@/lib/types'

export function InsightCard({ insight }: { insight: AIInsight }) {
  const borderColors: Record<string, string> = {
    critical: 'border-l-danger',
    warning: 'border-l-warning',
    good: 'border-l-success'
  }

  const badgeColors: Record<string, string> = {
    critical: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
    good: 'bg-success/10 text-success'
  }

  return (
    <div className={`bg-white rounded-lg p-5 border-y border-r border-border border-l-4 shadow-sm ${borderColors[insight.severity]}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-text-primary text-base">{insight.title}</h4>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${badgeColors[insight.severity]}`}>
          {insight.severity}
        </span>
      </div>
      <p className="text-text-secondary text-sm mb-4 leading-relaxed">
        {insight.description}
      </p>
      
      <div className="bg-surface rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-sm font-medium text-text-primary">Action: {insight.specific_action}</span>
        </div>
        {insight.estimated_benefit_inr && (
          <div className="text-sm font-semibold text-success whitespace-nowrap bg-success/5 px-2.5 py-1 rounded-md">
            Est. Benefit: ₹{insight.estimated_benefit_inr.toLocaleString('en-IN')}
          </div>
        )}
      </div>
    </div>
  )
}
