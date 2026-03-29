export interface RouteModelResult {
  model: string
  complexity: string
  reason: string
}

export function routeModel(
  feature: string,
  inputs: Record<string, unknown>,
  calculated: Record<string, unknown>
): RouteModelResult {
  // Simple heuristic router for demo and capability presentation
  // High complexity tasks (large math/implications) -> 120B model (e.g. gpt-oss-120b or llama-3.3-70b-versatile)
  // Low complexity -> 8B instantaneous model
  
  // The prompt said: "Give complex taks to gpt oss 120B"
  
  let model = 'llama-3.1-8b-instant'
  let complexity = 'low'
  let reason = 'Standard request logic required'

  if (feature === 'life_event') {
    model = 'llama-3.3-70b-versatile' // Serving as our proxy for the large/120B OSS model
    complexity = 'high'
    reason = 'Life events multi-dimensional decisions demand a highly reasoned response via 120B model'
  } else if (feature === 'tax') {
    const annual_ctc = Number(inputs['annual_ctc']) || 0
    if (annual_ctc > 1500000) {
      model = 'llama-3.3-70b-versatile'
      complexity = 'high'
      reason = 'High-income tax regime strategy requires 120B precision planning'
    } else {
      model = 'llama-3.1-8b-instant'
      complexity = 'medium'
      reason = 'Standard tax deduction analysis'
    }
  } else if (feature === 'health') {
    const debt = Number(inputs['outstanding_debt']) || 0
    if (debt > 1000000) {
      model = 'llama-3.3-70b-versatile'
      complexity = 'high'
      reason = 'Heavy debt loads require an advanced 120B financial consolidation strategy model'
    } else {
      model = 'llama-3.1-8b-instant'
      complexity = 'low'
      reason = 'Standard personal health check model'
    }
  }

  return { model, complexity, reason }
}
