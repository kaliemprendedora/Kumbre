// Core domain types for Kumbre

// ─── Universe ────────────────────────────────────────────────────────────────

export type UniverseType = 'personal' | 'business' | 'project'

export interface Universe {
  id: string
  userId: string
  name: string
  type: UniverseType
  currency: string
  color: string
  icon: string
  settings: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

// ─── Account ─────────────────────────────────────────────────────────────────

export type AccountType = 'checking' | 'savings' | 'cash' | 'investment' | 'crypto'

export interface Account {
  id: string
  universeId: string
  name: string
  type: AccountType
  balance: number
  institution?: string
  color: string
  icon: string
  createdAt: string
  updatedAt: string
}

// ─── Category ────────────────────────────────────────────────────────────────

export type TransactionDirection = 'income' | 'expense' | 'transfer'

export interface Category {
  id: string
  universeId: string
  name: string
  parentId?: string
  color: string
  icon: string
  type: TransactionDirection
  rules: CategoryRule[]
}

export interface CategoryRule {
  field: 'description' | 'amount' | 'merchant'
  operator: 'contains' | 'equals' | 'gt' | 'lt'
  value: string | number
}

// ─── Transaction ─────────────────────────────────────────────────────────────

export type TransactionCreatedVia = 'manual' | 'ocr' | 'rule' | 'import'

export interface Transaction {
  id: string
  universeId: string
  accountId: string
  amount: number
  type: TransactionDirection
  date: string
  description: string
  categoryId?: string
  tags: string[]
  fundId?: string
  objectiveId?: string
  isRecurring: boolean
  recurrenceRule?: RecurrenceRule
  receiptImageUrl?: string
  createdVia: TransactionCreatedVia
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  endDate?: string
}

// ─── Objective (Cumbre) ───────────────────────────────────────────────────────

export type ObjectiveType = 'financial' | 'non_financial'
export type ObjectiveStatus = 'on_track' | 'at_risk' | 'completed' | 'paused' | 'archived'

export interface Objective {
  id: string
  universeId: string
  name: string
  description: string
  type: ObjectiveType
  priority: number
  targetAmount?: number
  targetDate?: string
  currentAmount: number
  status: ObjectiveStatus
  fundIds: string[]
  color: string
  icon: string
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Fund ────────────────────────────────────────────────────────────────────

export interface Fund {
  id: string
  universeId: string
  name: string
  targetAmount?: number
  currentAmount: number
  objectiveIds: string[]
  rules: FundRule[]
  color: string
  icon: string
  notes: string
  createdAt: string
  updatedAt: string
}

export interface FundRule {
  trigger: 'on_income'
  percentage?: number
  fixedAmount?: number
}

// ─── Simulation ──────────────────────────────────────────────────────────────

export type SimulationType =
  | 'purchase'
  | 'recurring_expense'
  | 'income'
  | 'hire'
  | 'credit'
  | 'investment'

export interface Simulation {
  id: string
  universeId: string
  title: string
  type: SimulationType
  inputs: SimulationInputs
  results: SimulationResults
  saved: boolean
  createdAt: string
}

export interface SimulationInputs {
  amount: number
  paymentMethod?: 'cash' | 'installments' | 'card_no_interest' | 'card_with_interest'
  installments?: number
  interestRate?: number
  monthlyAmount?: number
  description?: string
}

export interface SimulationResults {
  monthlyCost: number
  totalCost: number
  totalInterest: number
  cashflowImpact: MonthlyCashflow[]
  objectivesImpact: ObjectiveImpact[]
  netWorthImpact: number
  alternatives: SimulationAlternative[]
}

export interface MonthlyCashflow {
  month: string
  income: number
  expenses: number
  savings: number
}

export interface ObjectiveImpact {
  objectiveId: string
  objectiveName: string
  monthsDelayed: number
  newTargetDate: string
}

export interface SimulationAlternative {
  title: string
  description: string
  monthsDelayed: number
}

// ─── Card ────────────────────────────────────────────────────────────────────

export interface Card {
  id: string
  universeId: string
  name: string
  institution: string
  limit: number
  currentDebt: number
  cutDate: number
  paymentDate: number
  interestRate: number
  installments: CardInstallment[]
}

export interface CardInstallment {
  id: string
  description: string
  totalAmount: number
  monthlyAmount: number
  remainingMonths: number
  startDate: string
}

// ─── Debt ────────────────────────────────────────────────────────────────────

export type DebtType = 'mortgage' | 'personal' | 'vehicle' | 'other'

export interface Debt {
  id: string
  universeId: string
  name: string
  institution: string
  originalAmount: number
  remainingAmount: number
  monthlyPayment: number
  interestRate: number
  startDate: string
  endDate: string
  type: DebtType
}

// ─── Investment ──────────────────────────────────────────────────────────────

export type InvestmentType = 'stock' | 'fund' | 'etf' | 'crypto' | 'real_estate' | 'other'

export interface Investment {
  id: string
  universeId: string
  name: string
  type: InvestmentType
  quantity: number
  avgCost: number
  currentValue: number
  objectiveId?: string
  notes: string
  updatedAt: string
}

// ─── Project (Business) ──────────────────────────────────────────────────────

export type ProjectStatus = 'active' | 'completed' | 'paused'

export interface Project {
  id: string
  universeId: string
  name: string
  client: string
  status: ProjectStatus
  estimatedIncome: number
  actualIncome: number
  estimatedCost: number
  actualCost: number
  startDate: string
  endDate?: string
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: 'es' | 'en'
  currency: string
  locale: string
  activeUniverseId: string
}

export interface User {
  id: string
  email: string
  name: string
  preferences: UserPreferences
  createdAt: string
}

// ─── App State ───────────────────────────────────────────────────────────────

export interface AppState {
  user: User | null
  universes: Universe[]
  activeUniverseId: string | null
  accounts: Account[]
  categories: Category[]
  transactions: Transaction[]
  objectives: Objective[]
  funds: Fund[]
  simulations: Simulation[]
  cards: Card[]
  debts: Debt[]
  investments: Investment[]
  projects: Project[]
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
  soon?: boolean
}
