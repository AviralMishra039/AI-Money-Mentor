import { runValidator } from './agents/validator'
import { routeModel } from './agents/router'
import { runGuardrail } from './agents/guardrail'
import { saveAuditLog } from './agents/audit'
import { calcHealthScore, calcTax, calcLifeAllocation } from './calculations'

export type AgentStep = 
  'validating' | 'calculating' | 'analyzing' | 'generating' | 'guardrail' | 'done' | 'error'

export interface OrchestrationResult {
  success: boolean
  steps: StepLog[]
  calculated_data: Record<string, unknown>
  ai_output: Record<string, unknown> | null
  fallback_mode: boolean
  error?: string
}

export interface StepLog {
  agent: string
  status: 'success' | 'failed' | 'skipped'
  input_summary: string
  output_summary: string
  duration_ms: number
  timestamp: string
}

function runCalculator(feature: string, inputs: any): any {
  if (feature === 'health') return calcHealthScore(inputs as any)
  if (feature === 'tax') return calcTax(inputs as any)
  if (feature === 'life_event') return calcLifeAllocation(inputs as any)
  return {}
}

export async function orchestrate(
  feature: string,
  inputs: Record<string, unknown>,
  onStepChange: (step: AgentStep) => void
): Promise<OrchestrationResult> {
  const steps: StepLog[] = []
  const sessionId = crypto.randomUUID()

  // AGENT 1: Validator
  onStepChange('validating')
  const t1 = Date.now()
  const validation = runValidator(feature, inputs)
  steps.push({
    agent: 'Validator',
    status: validation.valid ? 'success' : 'failed',
    input_summary: `${Object.keys(inputs).length} fields received`,
    output_summary: validation.valid ? 'All inputs valid' : validation.errors.join(', '),
    duration_ms: Date.now() - t1,
    timestamp: new Date().toISOString()
  })
  if (!validation.valid) {
    await saveAuditLog(sessionId, feature, steps, null)
    return { success: false, steps, calculated_data: {}, ai_output: null, fallback_mode: false, error: validation.errors.join(', ') }
  }

  // AGENT 2: Calculator (pure math, no AI)
  onStepChange('calculating')
  const t2 = Date.now()
  const calculated = runCalculator(feature, inputs)
  steps.push({
    agent: 'Calculator',
    status: 'success',
    input_summary: `Feature: ${feature}`,
    output_summary: `Calculated values generated`,
    duration_ms: Date.now() - t2,
    timestamp: new Date().toISOString()
  })

  // AGENT 3: Complexity Router — decides which model to use
  onStepChange('analyzing')
  const t3 = Date.now()
  const model = routeModel(feature, inputs, calculated)
  steps.push({
    agent: 'Router',
    status: 'success',
    input_summary: `Feature complexity: ${model.complexity}`,
    output_summary: `Routed to ${model.model} — reason: ${model.reason}`,
    duration_ms: Date.now() - t3,
    timestamp: new Date().toISOString()
  })

  // AGENT 4: Insight Generator 
  onStepChange('generating')
  const t4 = Date.now()
  let ai_output = null
  let fallback_mode = false
  try {
    const res = await fetch('/api/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature, inputs, calculated_data: calculated, model: model.model })
    })
    const json = await res.json()
    if (!json.success) throw new Error('AI call failed')
    ai_output = json.data
    steps.push({
      agent: 'Insight Generator',
      status: 'success',
      input_summary: `Model: ${model.model}`,
      output_summary: `Generated insight categories`,
      duration_ms: Date.now() - t4,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    fallback_mode = true
    steps.push({
      agent: 'Insight Generator',
      status: 'failed',
      input_summary: `Model: ${model.model}`,
      output_summary: 'AI unavailable — falling back to calculated results only',
      duration_ms: Date.now() - t4,
      timestamp: new Date().toISOString()
    })
  }

  // AGENT 5: Guardrail — strips unlicensed advisory language
  onStepChange('guardrail')
  const t5 = Date.now()
  const guarded = ai_output ? runGuardrail(ai_output) : null
  steps.push({
    agent: 'Guardrail',
    status: 'success',
    input_summary: ai_output ? 'AI output received' : 'No AI output to check',
    output_summary: guarded?.flagged_count
      ? `Flagged and softened ${guarded.flagged_count} directive phrases`
      : 'No compliance issues found',
    duration_ms: Date.now() - t5,
    timestamp: new Date().toISOString()
  })

  // Save audit log
  await saveAuditLog(sessionId, feature, steps, guarded?.output ?? null)

  onStepChange('done')
  return {
    success: true,
    steps,
    calculated_data: calculated,
    ai_output: guarded?.output ?? null,
    fallback_mode
  }
}
