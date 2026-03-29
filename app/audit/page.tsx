'use client'

import { useEffect, useState } from 'react'
import { getAuditLog, AuditEntry } from '@/lib/agents/audit'
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Cpu } from 'lucide-react'

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([])

  useEffect(() => {
    setLogs(getAuditLog().slice(0, 10)) // Last 10 runs
  }, [])

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold font-mono">System Audit Log</h1>
          <p className="text-text-secondary text-sm">Enterprise readiness trail — last 10 agent orchestration runs</p>
        </div>
      </div>

      {logs.length === 0 && (
        <div className="border border-border border-dashed p-12 text-center rounded-xl bg-surface text-text-secondary font-mono text-sm">
          No orchestration logs found. Run a feature to generate audit trails.
        </div>
      )}

      <div className="space-y-6">
        {logs.map((log, idx) => (
          <div key={idx} className="bg-white border border-border rounded-lg shadow-sm overflow-hidden font-mono text-sm">
            <div className="bg-surface px-4 py-3 border-b border-border flex flex-wrap gap-4 items-center justify-between text-xs font-bold text-text-secondary">
               <div className="flex items-center gap-4">
                 <span className="bg-border/50 px-2 py-1 rounded inline-block">ID: {log.session_id.split('-')[0]}</span>
                 <span className="uppercase text-primary">{log.feature.replace('_', ' ')}</span>
                 <span>{new Date(log.timestamp).toLocaleString()}</span>
               </div>
               <div className="flex items-center gap-3">
                 <span className="flex items-center gap-1">
                   <Cpu className="w-3.5 h-3.5" />
                   {log.fallback_used ? <span className="text-amber-600">Fallback Math</span> : <span className="text-success">AI Active</span>}
                 </span>
                 {log.guardrail_flags > 0 && (
                   <span className="px-2 py-0.5 bg-danger/10 text-danger rounded border border-danger/20">
                     {log.guardrail_flags} guardrail flags mitigated
                   </span>
                 )}
               </div>
            </div>
            
            <div className="p-4 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-text-secondary border-b border-border">
                    <th className="pb-2 font-medium w-40">Agent Node</th>
                    <th className="pb-2 font-medium w-24">Status</th>
                    <th className="pb-2 font-medium w-24 text-right">Latency</th>
                    <th className="pb-2 font-medium pl-6">I/O Signature</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {log.steps.map((step, i) => (
                    <tr key={i} className="border-b last:border-0 border-surface">
                      <td className="py-3 font-semibold text-text-primary">{step.agent}</td>
                      <td className="py-3">
                         {step.status === 'success' 
                           ? <div className="text-success flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> OK</div>
                           : <div className="text-danger flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> FAIL</div>
                         }
                      </td>
                      <td className="py-3 text-right text-text-secondary">{step.duration_ms}ms</td>
                      <td className="py-3 pl-6">
                        <div className="text-text-secondary truncate max-w-md" title={step.input_summary}>
                          <ArrowRight className="w-3 h-3 inline mr-1 text-border" /> 
                          {step.input_summary}
                        </div>
                        <div className="text-text-primary truncate max-w-md mt-0.5" title={step.output_summary}>
                          <ArrowRight className="w-3 h-3 inline mr-1 text-success" /> 
                          {step.output_summary}
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
