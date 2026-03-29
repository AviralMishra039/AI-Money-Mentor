'use client'

import { useEffect, useState } from 'react'
import { getAuditLog, AuditEntry } from '@/lib/agents/audit'
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Cpu, Clock, Hash } from 'lucide-react'

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([])

  useEffect(() => {
    setLogs(getAuditLog().slice(0, 10))
  }, [])

  return (
    <div className="max-w-5xl mx-auto et-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded bg-navy flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-2xl text-navy">System Audit Log</h1>
          <p className="text-text-tertiary text-xs mt-0.5">Enterprise readiness trail — last 10 agent orchestration runs</p>
        </div>
      </div>

      {logs.length === 0 && (
        <div className="et-panel p-16 text-center">
          <Cpu className="w-10 h-10 text-text-tertiary mx-auto mb-4 opacity-40" />
          <p className="text-text-tertiary font-medium text-sm">No orchestration logs found.</p>
          <p className="text-text-tertiary text-xs mt-1">Run a feature to generate audit trails.</p>
        </div>
      )}

      <div className="space-y-6">
        {logs.map((log, idx) => (
          <div key={idx} className="et-panel overflow-hidden">
            {/* Log Header */}
            <div className="bg-surface-warm px-5 py-3 border-b border-border flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-bold text-text-tertiary">
                <span className="et-badge bg-white border border-border text-text-secondary flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {log.session_id.split('-')[0]}
                </span>
                <span className="et-badge bg-primary/10 text-primary border border-primary/20 uppercase">
                  {log.feature.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1 text-text-tertiary">
                  <Clock className="w-3 h-3" />
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-bold">
                  <Cpu className="w-3.5 h-3.5 text-text-tertiary" />
                  {log.fallback_used 
                    ? <span className="text-warning">Fallback Math</span> 
                    : <span className="text-success">AI Active</span>
                  }
                </span>
                {log.guardrail_flags > 0 && (
                  <span className="et-badge bg-danger/10 text-danger border border-danger/20">
                    {log.guardrail_flags} guardrail flags
                  </span>
                )}
              </div>
            </div>
            
            {/* Log Body */}
            <div className="p-5">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="text-text-tertiary border-b border-border">
                    <th className="pb-3 font-bold w-40 uppercase tracking-wider text-[10px]">Agent Node</th>
                    <th className="pb-3 font-bold w-24 uppercase tracking-wider text-[10px]">Status</th>
                    <th className="pb-3 font-bold w-24 text-right uppercase tracking-wider text-[10px]">Latency</th>
                    <th className="pb-3 font-bold pl-6 uppercase tracking-wider text-[10px]">I/O Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {log.steps.map((step, i) => (
                    <tr key={i} className="border-b last:border-0 border-border-light hover:bg-surface/50 transition-colors">
                      <td className="py-3 font-bold text-navy">{step.agent}</td>
                      <td className="py-3">
                        {step.status === 'success' 
                          ? <div className="text-success flex items-center gap-1 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> OK</div>
                          : <div className="text-danger flex items-center gap-1 font-bold"><XCircle className="w-3.5 h-3.5" /> FAIL</div>
                        }
                      </td>
                      <td className="py-3 text-right text-text-tertiary font-semibold">{step.duration_ms}ms</td>
                      <td className="py-3 pl-6">
                        <div className="text-text-tertiary truncate max-w-md flex items-center gap-1" title={step.input_summary}>
                          <ArrowRight className="w-3 h-3 text-border shrink-0" /> 
                          <span className="truncate">{step.input_summary}</span>
                        </div>
                        <div className="text-navy truncate max-w-md mt-0.5 flex items-center gap-1" title={step.output_summary}>
                          <ArrowRight className="w-3 h-3 text-success shrink-0" /> 
                          <span className="truncate">{step.output_summary}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
