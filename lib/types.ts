export interface HealthInputs {
  monthly_income: number
  monthly_expenses: number
  emergency_fund_months: number
  term_insurance_lakhs: number
  monthly_sip: number
  outstanding_debt: number
  age: number
  tax_saving_yearly: number
}

export interface HealthDims {
  emergency: number
  insurance: number
  investments: number
  debt: number
  tax: number
  retirement: number
}

export interface HealthScore {
  dims: HealthDims
  overall: number
}

export interface TaxInputs {
  annual_ctc: number
  hra_received: number
  rent_paid: number
  is_metro: boolean
  investments_80c: number
  nps_80ccd: number
  home_loan_interest: number
  medical_80d: number
}

export interface TaxResult {
  old_taxable: number
  new_taxable: number
  old_tax: number
  new_tax: number
  recommended: 'old' | 'new'
  saving: number
  hra_exemption: number
  total_old_deductions: number
  breakeven_deductions: number
}

export interface LifeInputs {
  event_type: 'bonus' | 'new_baby' | 'marriage' | 'inheritance'
  event_amount: number
  age: number
  monthly_income: number
  tax_bracket: 10 | 20 | 30
  risk_profile: 'aggressive' | 'moderate' | 'conservative'
  existing_debt: number
  debt_interest_rate: number
}

export interface AIInsight {
  dimension?: string
  severity: 'critical' | 'warning' | 'good'
  title: string
  description: string
  specific_action: string
  estimated_benefit_inr?: number
}
