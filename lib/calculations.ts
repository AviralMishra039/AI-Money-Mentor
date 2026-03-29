import { HealthInputs, HealthDims, HealthScore, TaxInputs, TaxResult, LifeInputs } from './types'

export function calcHealthScore(inputs: HealthInputs): HealthScore {
  const dims: HealthDims = {
    emergency: Math.min(100, Math.round((inputs.emergency_fund_months / 6) * 100)),
    insurance: Math.min(100, Math.round(
      (inputs.term_insurance_lakhs * 100000) / (inputs.monthly_income * 12 * 10) * 100
    )),
    investments: Math.min(100, Math.round((inputs.monthly_sip / inputs.monthly_income) * 500)),
    debt: Math.min(100, Math.round(
      Math.max(0, 100 - (inputs.outstanding_debt / (inputs.monthly_income * 12)) * 50)
    )),
    tax: Math.min(100, Math.round((inputs.tax_saving_yearly / 150000) * 100)),
    retirement: Math.min(100, Math.round(
      ((60 - inputs.age) / 30) *
      ((inputs.monthly_income - inputs.monthly_expenses) / inputs.monthly_income) * 200
    ))
  }
  const overall = Math.round(Object.values(dims).reduce((a, b) => a + b, 0) / 6)
  return { dims, overall }
}

export function calcHRAExemption(
  hra: number, rent: number, basic: number, isMetro: boolean
): number {
  if (rent === 0) return 0
  return Math.max(0, Math.min(
    hra,
    rent - basic * 0.10,
    basic * (isMetro ? 0.50 : 0.40)
  ))
}

export function calcOldRegimeTax(taxable: number): number {
  if (taxable <= 250000) return 0
  let tax = 0
  if (taxable > 1000000) tax += (taxable - 1000000) * 0.30
  if (taxable > 500000)  tax += (Math.min(taxable, 1000000) - 500000) * 0.20
  if (taxable > 250000)  tax += (Math.min(taxable, 500000) - 250000) * 0.05
  return Math.round(tax * 1.04)
}

export function calcNewRegimeTax(taxable: number): number {
  const taxable_after_std = Math.max(0, taxable - 75000)
  if (taxable_after_std <= 700000) return 0
  const slabs: [number, number][] = [
    [300000, 0], [600000, 0.05], [900000, 0.10],
    [1200000, 0.15], [1500000, 0.20], [Infinity, 0.30]
  ]
  let tax = 0, prev = 0
  for (const [limit, rate] of slabs) {
    if (taxable_after_std <= prev) break
    tax += (Math.min(taxable_after_std, limit) - prev) * rate
    prev = limit
  }
  return Math.round(tax * 1.04)
}

export function calcTax(inputs: TaxInputs): TaxResult {
  const basic = inputs.annual_ctc * 0.40
  const hra_exemption = calcHRAExemption(
    inputs.hra_received, inputs.rent_paid, basic, inputs.is_metro
  )
  const old_deductions =
    50000 +
    Math.min(hra_exemption, inputs.hra_received) +
    Math.min(inputs.investments_80c, 150000) +
    Math.min(inputs.nps_80ccd, 50000) +
    Math.min(inputs.home_loan_interest, 200000) +
    Math.min(inputs.medical_80d, 25000)

  const old_taxable = Math.max(0, inputs.annual_ctc - old_deductions)
  const new_taxable = inputs.annual_ctc
  const old_tax = calcOldRegimeTax(old_taxable)
  const new_tax = calcNewRegimeTax(new_taxable)
  const recommended = old_tax <= new_tax ? 'old' : 'new'

  // Breakeven: deductions needed for old regime to match new
  const breakeven_deductions = Math.round(inputs.annual_ctc * 0.25)

  return {
    old_taxable, new_taxable, old_tax, new_tax,
    recommended, saving: Math.abs(old_tax - new_tax),
    hra_exemption, total_old_deductions: old_deductions,
    breakeven_deductions
  }
}

export function calcLifeAllocation(inputs: LifeInputs): Array<{
  label: string, percentage: number, amount: number, rationale: string
}> {
  const amt = inputs.event_amount

  // Edge case: high-interest debt check
  const shouldPrepayDebt =
    inputs.existing_debt > 0 && inputs.debt_interest_rate > 12

  if (inputs.event_type === 'bonus') {
    if (shouldPrepayDebt) {
      const prepay_pct = Math.min(40, Math.round((inputs.existing_debt / amt) * 100))
      const remaining = 100 - prepay_pct
      return [
        { label: 'Loan prepayment', percentage: prepay_pct, amount: Math.round(amt * prepay_pct / 100), rationale: `Guaranteed ${inputs.debt_interest_rate}% return — beats market` },
        { label: 'Tax saving (ELSS/NPS)', percentage: 20, amount: Math.round(amt * 0.20), rationale: 'Reduce this year\'s tax liability first' },
        { label: 'Equity MF (via STP)', percentage: Math.round(remaining * 0.55), amount: Math.round(amt * remaining * 0.55 / 100), rationale: 'Deploy over 6 months to average cost' },
        { label: 'Liquid / emergency top-up', percentage: Math.round(remaining * 0.45), amount: Math.round(amt * remaining * 0.45 / 100), rationale: 'Keep 6 months expenses accessible' },
      ]
    }
    return [
      { label: 'Tax saving (ELSS/NPS)', percentage: 20, amount: Math.round(amt * 0.20), rationale: 'Reduce this year\'s tax liability immediately' },
      { label: 'Emergency fund top-up', percentage: 15, amount: Math.round(amt * 0.15), rationale: 'If below 6 months, this is priority 1' },
      { label: 'Equity MF (via STP)', percentage: inputs.risk_profile === 'aggressive' ? 50 : 35, amount: Math.round(amt * (inputs.risk_profile === 'aggressive' ? 0.50 : 0.35)), rationale: 'Core wealth builder — STP over 6 months' },
      { label: 'Debt MF / FD', percentage: inputs.risk_profile === 'aggressive' ? 15 : 30, amount: Math.round(amt * (inputs.risk_profile === 'aggressive' ? 0.15 : 0.30)), rationale: 'Goals within 3 years' },
    ]
  }

  if (inputs.event_type === 'marriage') {
    return [
      { label: 'Joint emergency fund', percentage: 25, amount: Math.round(amt * 0.25), rationale: 'Rebuild for combined household expenses' },
      { label: 'Home down payment goal', percentage: 35, amount: Math.round(amt * 0.35), rationale: 'Target 20% down in 3–5 years via hybrid MF' },
      { label: 'ELSS — self (80C)', percentage: 20, amount: Math.round(amt * 0.20), rationale: 'Both partners claim 80C independently — ₹3L combined' },
      { label: 'NPS — spouse (80CCD)', percentage: 20, amount: Math.round(amt * 0.20), rationale: 'Employer NPS matching + extra ₹50K deduction' },
    ]
  }

  if (inputs.event_type === 'new_baby') {
    return [
      { label: 'Child education fund', percentage: 40, amount: Math.round(amt * 0.40), rationale: '18-year horizon — aggressive equity allocation' },
      { label: 'Emergency fund boost', percentage: 30, amount: Math.round(amt * 0.30), rationale: 'Raise to 9 months — baby adds expenses' },
      { label: 'Term insurance top-up', percentage: 5, amount: Math.round(amt * 0.05), rationale: 'Increase cover by ₹50–75L with new dependent' },
      { label: 'Sukanya / PPF', percentage: 25, amount: Math.round(amt * 0.25), rationale: 'Tax-free long-term corpus for child' },
    ]
  }

  // inheritance
  return [
    { label: 'Loan prepayment', percentage: 20, amount: Math.round(amt * 0.20), rationale: 'Guaranteed return = your interest rate' },
    { label: 'Multi-cap equity MF', percentage: inputs.risk_profile === 'aggressive' ? 45 : 30, amount: Math.round(amt * (inputs.risk_profile === 'aggressive' ? 0.45 : 0.30)), rationale: 'Core long-term wealth builder' },
    { label: 'Debt MF / bonds', percentage: inputs.risk_profile === 'aggressive' ? 15 : 30, amount: Math.round(amt * (inputs.risk_profile === 'aggressive' ? 0.15 : 0.30)), rationale: 'Better post-tax return than FD' },
    { label: 'Sovereign gold bonds', percentage: 10, amount: Math.round(amt * 0.10), rationale: 'Hedge + tax-efficient vs physical gold' },
    { label: 'Liquid fund (keep accessible)', percentage: 25, amount: Math.round(amt * 0.25), rationale: 'Emergency + upcoming large expenses' },
  ]
}
