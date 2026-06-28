// Engine input types — pure data, zero React/Next.js dependencies.
// These are deliberately separate from the domain types in @/types
// so the engine can be extracted to its own package later.

export type AccountKind = 'checking' | 'savings' | 'cash' | 'investment' | 'crypto' | 'other'
export type TransactionKind = 'income' | 'expense' | 'transfer'
export type FrequencyKind = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'one_time'
export type DebtKind = 'mortgage' | 'personal' | 'vehicle' | 'credit_card' | 'other'
export type InvestmentKind = 'stock' | 'fund' | 'etf' | 'crypto' | 'real_estate' | 'other'
export type ObjectiveStatus = 'on_track' | 'at_risk' | 'completed' | 'paused'
export type RiskTolerance = 'low' | 'medium' | 'high'

export interface EngineAccount {
  id: string
  name: string
  kind: AccountKind
  balance: number
  isLiquid: boolean
}

export interface EngineTransaction {
  id: string
  accountId: string
  amount: number
  kind: TransactionKind
  date: string
  categoryId?: string
  categoryName?: string
  isRecurring: boolean
  frequency?: FrequencyKind
  description: string
  tags: string[]
}

export interface EngineDebt {
  id: string
  name: string
  kind: DebtKind
  originalAmount: number
  remainingAmount: number
  monthlyPayment: number
  interestRate: number
  startDate: string
  endDate: string
}

export interface EngineInvestment {
  id: string
  name: string
  kind: InvestmentKind
  currentValue: number
  avgCost: number
  quantity: number
  expectedAnnualReturn?: number
}

export interface EngineObjective {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: string
  priority: number
  status: ObjectiveStatus
  linkedFundIds: string[]
}

export interface EngineFund {
  id: string
  name: string
  currentAmount: number
  targetAmount?: number
  objectiveIds: string[]
  allocationRule: FundAllocationRule
}

export interface FundAllocationRule {
  trigger: 'on_income' | 'on_surplus' | 'fixed_monthly'
  percentage?: number
  fixedAmount?: number
}

// The complete snapshot of financial state at a point in time.
// This is what every engine operates on.
export interface FinancialSnapshot {
  asOf: string
  accounts: EngineAccount[]
  transactions: EngineTransaction[]
  debts: EngineDebt[]
  investments: EngineInvestment[]
  objectives: EngineObjective[]
  funds: EngineFund[]
  rules: Rule[]
}

// ─── Rules ───────────────────────────────────────────────────────────────────

export type RuleKind =
  | 'min_savings_rate'
  | 'max_debt_to_income'
  | 'max_card_utilization'
  | 'emergency_fund_months'
  | 'goal_protected'
  | 'fund_protected'
  | 'max_single_expense_ratio'

export interface Rule {
  id: string
  kind: RuleKind
  label: string
  value: number
  targetId?: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  enabled: boolean
}

// ─── Decisions (for SimulationEngine) ───────────────────────────────────────

export type DecisionType =
  | 'purchase'
  | 'recurring_expense'
  | 'income_change'
  | 'investment'
  | 'credit'
  | 'hire'
  | 'real_estate'
  | 'travel'
  | 'withdrawal'
  | 'new_venture'

export interface Decision {
  type: DecisionType
  description: string
  amount: number
  startDate: string
  installments?: number
  interestRate?: number
  monthlyAmount?: number
  durationMonths?: number
  recurring?: boolean
  expectedReturn?: number
}

// ─── Scenario assumptions ────────────────────────────────────────────────────

export interface Assumptions {
  incomeGrowthRate?: number
  expenseGrowthRate?: number
  investmentReturnRate?: number
  inflationRate?: number
  incomeShockFactor?: number
  expenseShockFactor?: number
}

export const SCENARIO_PRESETS: Record<string, Assumptions> = {
  optimistic: {
    incomeGrowthRate: 0.02,
    expenseGrowthRate: -0.01,
    investmentReturnRate: 0.08,
    inflationRate: 0.03,
  },
  conservative: {
    incomeGrowthRate: 0.005,
    expenseGrowthRate: 0.015,
    investmentReturnRate: 0.04,
    inflationRate: 0.04,
  },
  crisis: {
    incomeGrowthRate: -0.15,
    expenseGrowthRate: 0.05,
    investmentReturnRate: -0.2,
    inflationRate: 0.08,
  },
}
