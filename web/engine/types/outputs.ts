// Engine output types — all structured data, never free text.
// The AI layer is responsible for turning these into human-readable language.

export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical'

// ─── CashFlowEngine ──────────────────────────────────────────────────────────

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  amount: number
  percentage: number
  transactionCount: number
}

export interface CashFlowResult {
  period: { start: string; end: string }
  income: number
  expenses: number
  net: number
  savingsRate: number
  byCategory: CategoryBreakdown[]
  recurringIncome: number
  recurringExpenses: number
  oneTimeIncome: number
  oneTimeExpenses: number
  largestExpenseCategory: string | null
}

// ─── NetWorthEngine ─────────────────────────────────────────────────────────

export interface NetWorthResult {
  totalAssets: number
  liquidAssets: number
  illiquidAssets: number
  totalLiabilities: number
  netWorth: number
  debtToAssetRatio: number
  assetBreakdown: {
    cash: number
    savings: number
    investments: number
    realEstate: number
    other: number
  }
  liabilityBreakdown: {
    mortgages: number
    personalLoans: number
    vehicleLoans: number
    creditCards: number
    other: number
  }
}

// ─── DebtEngine ─────────────────────────────────────────────────────────────

export interface DebtDetail {
  id: string
  name: string
  remainingAmount: number
  monthlyPayment: number
  interestRate: number
  remainingMonths: number
  totalInterestRemaining: number
  payoffDate: string
}

export interface DebtResult {
  totalDebt: number
  totalMonthlyPayment: number
  debtToIncomeRatio: number
  weightedInterestRate: number
  estimatedDebtFreeDate: string
  riskLevel: RiskLevel
  debts: DebtDetail[]
  highestInterestDebt: string | null
  largestDebt: string | null
}

// ─── GoalEngine ─────────────────────────────────────────────────────────────

export interface ObjectiveDetail {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  remaining: number
  progressPercent: number
  targetDate: string
  projectedCompletionDate: string
  monthsRemaining: number
  monthsUntilTarget: number
  requiredMonthlySaving: number
  currentMonthlySaving: number
  isOnTrack: boolean
  isAtRisk: boolean
  surplusOrDeficit: number
}

export interface GoalResult {
  objectives: ObjectiveDetail[]
  totalRequired: number
  totalCurrent: number
  totalRemaining: number
  totalMonthlyRequired: number
  feasibilityScore: number
  conflictingGoalIds: string[]
  criticalGoalIds: string[]
}

// ─── FundEngine ─────────────────────────────────────────────────────────────

export interface FundAllocation {
  fundId: string
  fundName: string
  currentAmount: number
  monthlyContribution: number
  targetAmount: number | null
  progressPercent: number
  linkedObjectiveIds: string[]
}

export interface FundResult {
  allocations: FundAllocation[]
  totalCurrentAmount: number
  totalMonthlyContribution: number
  remainingAfterAllocations: number
  coverageScore: number
}

// ─── CapacityEngine ─────────────────────────────────────────────────────────

export interface CapacityResult {
  monthlyAvailable: number
  savingsCapacity: number
  investmentCapacity: number
  additionalDebtCapacity: number
  emergencyFundMonths: number
  financialHealthScore: number
  breakdown: {
    income: number
    fixedExpenses: number
    variableExpenses: number
    debtPayments: number
    savings: number
    available: number
  }
}

// ─── RuleEngine ─────────────────────────────────────────────────────────────

export interface RuleViolation {
  ruleId: string
  ruleKind: string
  label: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  currentValue: number
  threshold: number
  severity: number
}

export interface RuleWarning {
  ruleId: string
  ruleKind: string
  label: string
  currentValue: number
  threshold: number
  marginPercent: number
}

export interface RuleEvaluationResult {
  compliant: boolean
  score: number
  violations: RuleViolation[]
  warnings: RuleWarning[]
  criticalCount: number
  highCount: number
}

// ─── ProjectionEngine ────────────────────────────────────────────────────────

export interface TimelinePoint {
  date: string
  monthIndex: number
  cashflow: CashFlowResult
  netWorth: NetWorthResult
  goals: GoalResult
  funds: FundResult
  capacity: CapacityResult
  cumulativeSavings: number
}

export interface ProjectionSummary {
  finalNetWorth: number
  netWorthGrowth: number
  netWorthGrowthPercent: number
  totalSaved: number
  totalIncome: number
  totalExpenses: number
  goalsAchievable: string[]
  goalsAtRisk: string[]
  projectedSavingsRate: number
}

export interface ProjectionResult {
  months: number
  startDate: string
  endDate: string
  timeline: TimelinePoint[]
  summary: ProjectionSummary
}

// ─── ScenarioEngine ─────────────────────────────────────────────────────────

export interface ScenarioComparison {
  name: string
  type: string
  finalNetWorth: number
  totalSaved: number
  goalsAchievable: string[]
  goalsAtRisk: string[]
  riskLevel: RiskLevel
  timeline: TimelinePoint[]
  differenceFromBase: {
    netWorth: number
    savings: number
    netWorthPercent: number
  }
}

export interface ScenarioResult {
  baseCase: ProjectionResult
  scenarios: ScenarioComparison[]
  worstCase: string
  bestCase: string
}

// ─── SimulationEngine ────────────────────────────────────────────────────────

export interface CashFlowImpact {
  monthlyDelta: number
  annualDelta: number
  newMonthlyCashflow: number
  newSavingsRate: number
  savingsRateDelta: number
}

export interface GoalImpact {
  goalId: string
  goalName: string
  monthsDelayed: number
  newProjectedDate: string
  originalProjectedDate: string
  isNowUnfeasible: boolean
}

export interface DebtImpact {
  additionalMonthlyPayment: number
  newDebtTotal: number
  newDebtToIncomeRatio: number
  totalInterestCost: number
  newDebtFreeDate: string | null
  riskLevelChange: RiskLevel
}

export interface NetWorthImpact {
  immediateImpact: number
  impactAt12Months: number
  impactAt60Months: number
  isAsset: boolean
}

export interface SavingsImpact {
  monthlySavingsDelta: number
  annualSavingsDelta: number
  opportunityCost: number
}

export interface GoalDelay {
  goalId: string
  goalName: string
  originalDate: string
  newDate: string
  delayMonths: number
}

export interface RecommendationData {
  kind: 'alternative_payment' | 'reduce_expense' | 'increase_income' | 'delay_decision' | 'split_cost' | 'use_fund'
  savingAmount?: number
  targetCategory?: string
  targetFundId?: string
  targetGoalId?: string
  durationMonths?: number
}

export interface AlternativeResult {
  description: string
  type: string
  monthlyCost: number
  totalCost: number
  goalImpacts: GoalImpact[]
  riskLevel: RiskLevel
}

export interface SimulationResult {
  decision: {
    type: string
    description: string
    amount: number
  }
  feasible: boolean
  feasibilityReason: string | null
  monthlyCost: number
  totalCost: number
  impactOnCashFlow: CashFlowImpact
  impactOnGoals: GoalImpact[]
  impactOnDebt: DebtImpact | null
  impactOnNetWorth: NetWorthImpact
  impactOnSavings: SavingsImpact
  delayInGoals: GoalDelay[]
  riskLevel: RiskLevel
  recommendationsData: RecommendationData[]
  alternatives: AlternativeResult[]
  baselineTimeline: TimelinePoint[]
  decisionTimeline: TimelinePoint[]
}
