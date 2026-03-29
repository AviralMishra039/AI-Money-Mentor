import { StepLog } from '../orchestrator'

export interface AuditEntry {
  session_id: string
  feature: string
  timestamp: string
  steps: StepLog[]
  ai_output_received: boolean
  fallback_used: boolean
  guardrail_flags: number
}

export async function saveAuditLog(
  sessionId: string,
  feature: string,
  steps: StepLog[],
  aiOutput: Record<string, unknown> | null
): Promise<void> {
  const entry: AuditEntry = {
    session_id: sessionId,
    feature,
    timestamp: new Date().toISOString(),
    steps,
    ai_output_received: aiOutput !== null,
    fallback_used: aiOutput === null,
    guardrail_flags: 0
  }

  try {
    // Store in localStorage for demo — swap for DB insert in production
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('et_audit_log') ?? '[]')
      existing.unshift(entry)
      localStorage.setItem('et_audit_log', JSON.stringify(existing.slice(0, 50)))
    }
  } catch (e) {
    console.error('Failed to save audit log', e)
  }
}

export function getAuditLog(): AuditEntry[] {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('et_audit_log') ?? '[]')
  }
  return []
}
