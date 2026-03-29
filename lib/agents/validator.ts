export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function runValidator(
  feature: string,
  inputs: Record<string, unknown>
): ValidationResult {
  const errors: string[] = []
  const n = (k: string) => Number(inputs[k]) || 0

  if (feature === 'health') {
    if (n('monthly_income') <= 0) errors.push('Monthly income must be greater than 0')
    if (n('monthly_expenses') >= n('monthly_income')) errors.push('Expenses exceed income — please recheck')
    if (n('age') < 18 || n('age') > 80) errors.push('Age must be between 18 and 80')
    if (n('emergency_fund_months') > 60) errors.push('Emergency fund months seems too high — please recheck')
  }

  if (feature === 'tax') {
    if (n('annual_ctc') < 250000) errors.push('CTC below taxable threshold — no tax liability')
    if (n('annual_ctc') > 100000000) errors.push('CTC value seems incorrect')
    if (n('investments_80c') > 150000) errors.push('80C max is ₹1,50,000 — capping at limit')
    if (n('nps_80ccd') > 50000) errors.push('80CCD(1B) max is ₹50,000 — capping at limit')
    if (n('rent_paid') > 0 && n('hra_received') === 0) errors.push('Rent paid but no HRA received — HRA exemption will not apply')
  }

  if (feature === 'life_event') {
    if (n('event_amount') <= 0) errors.push('Event amount must be greater than 0')
    if (n('debt_interest_rate') > 50) errors.push('Debt interest rate seems too high — please recheck')
    if (!inputs['event_type']) errors.push('Please select a life event')
  }

  // Soft warnings (valid but flagged in output)
  return { valid: errors.length === 0, errors }
}
