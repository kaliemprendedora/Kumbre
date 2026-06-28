import type { FinancialSnapshot, Decision, EngineTransaction, EngineDebt } from '../types/inputs'
import type {
  SimulationResult,
  CashFlowImpact,
  GoalImpact,
  DebtImpact,
  NetWorthImpact,
  SavingsImpact,
  GoalDelay,
  RecommendationData,
  AlternativeResult,
  RiskLevel,
} from '../types/outputs'
import { round, monthlyPayment, totalInterest } from '../core/mathUtils'
import { addMonthsISO, monthsBetweenISO } from '../core/dateUtils'
import { calculateCashFlow } from './CashFlowEngine'
import { calculateNetWorth } from './NetWorthEngine'
import { calculateDebt } from './DebtEngine'
import { calculateGoals } from './GoalEngine'
import { project } from './ProjectionEngine'

// ─── Decision cost resolvers ─────────────────────────────────────────────────

interface DecisionCost {
  monthlyCost: number
  totalCost: number
  durationMonths: number
  isDebt: boolean
  debtAmount: number
  interestCost: number
}

function resolveDecisionCost(decision: Decision): DecisionCost {
  const { type, amount, installments, interestRate = 0, monthlyAmount = 0, durationMonths = 1 } = decision

  switch (type) {
    case 'purchase': {
      if (installments && installments > 1) {
        const payment = monthlyPayment(amount, interestRate, installments)
        const interest = totalInterest(amount, interestRate, installments)
        return { monthlyCost: payment, totalCost: round(amount + interest, 0), durationMonths: installments, isDebt: interestRate > 0, debtAmount: amount, interestCost: interest }
      }
      return { monthlyCost: 0, totalCost: amount, durationMonths: 1, isDebt: false, debtAmount: 0, interestCost: 0 }
    }

    case 'recurring_expense':
    case 'hire': {
      const monthly = monthlyAmount || amount
      return { monthlyCost: monthly, totalCost: monthly * durationMonths, durationMonths, isDebt: false, debtAmount: 0, interestCost: 0 }
    }

    case 'credit': {
      const months = durationMonths || 12
      const payment = monthlyPayment(amount, interestRate, months)
      const interest = totalInterest(amount, interestRate, months)
      return { monthlyCost: payment, totalCost: round(amount + interest, 0), durationMonths: months, isDebt: true, debtAmount: amount, interestCost: interest }
    }

    case 'investment':
    case 'real_estate': {
      return { monthlyCost: 0, totalCost: amount, durationMonths: 1, isDebt: false, debtAmount: 0, interestCost: 0 }
    }

    case 'income_change': {
      // Positive = income increase, negative = decrease
      return { monthlyCost: -amount, totalCost: -amount * durationMonths, durationMonths, isDebt: false, debtAmount: 0, interestCost: 0 }
    }

    case 'travel':
    case 'withdrawal': {
      return { monthlyCost: 0, totalCost: amount, durationMonths: 1, isDebt: false, debtAmount: 0, interestCost: 0 }
    }

    default:
      return { monthlyCost: amount, totalCost: amount, durationMonths: 1, isDebt: false, debtAmount: 0, interestCost: 0 }
  }
}

// ─── Snapshot mutation helpers ────────────────────────────────────────────────

function applyDecisionToSnapshot(snapshot: FinancialSnapshot, decision: Decision, cost: DecisionCost): FinancialSnapshot {
  const { type } = decision
  let transactions = [...snapshot.transactions]
  let debts = [...snapshot.debts]
  let investments = [...snapshot.investments]
  let accounts = snapshot.accounts.map((a) => ({ ...a }))

  switch (type) {
    case 'purchase':
    case 'travel':
    case 'withdrawal': {
      if (cost.monthlyCost > 0) {
        transactions = [...transactions, {
          id: 'sim-recurring',
          accountId: accounts[0]?.id ?? '',
          amount: cost.monthlyCost,
          kind: 'expense' as const,
          date: decision.startDate,
          isRecurring: true,
          frequency: 'monthly' as const,
          description: decision.description,
          tags: ['simulation'],
        }]
      } else {
        accounts = accounts.map((a, i) => i === 0 ? { ...a, balance: a.balance - cost.totalCost } : a)
      }
      break
    }

    case 'recurring_expense':
    case 'hire': {
      transactions = [...transactions, {
        id: 'sim-recurring',
        accountId: accounts[0]?.id ?? '',
        amount: cost.monthlyCost,
        kind: 'expense' as const,
        date: decision.startDate,
        isRecurring: true,
        frequency: 'monthly' as const,
        description: decision.description,
        tags: ['simulation'],
      }]
      break
    }

    case 'income_change': {
      transactions = transactions.map((tx) =>
        tx.kind === 'income' && tx.isRecurring
          ? { ...tx, amount: tx.amount + decision.amount }
          : tx
      )
      break
    }

    case 'credit': {
      debts = [...debts, {
        id: 'sim-debt',
        name: decision.description,
        kind: 'personal' as const,
        originalAmount: decision.amount,
        remainingAmount: decision.amount,
        monthlyPayment: cost.monthlyCost,
        interestRate: decision.interestRate ?? 0,
        startDate: decision.startDate,
        endDate: addMonthsISO(decision.startDate, cost.durationMonths),
      }]
      accounts = accounts.map((a, i) => i === 0 ? { ...a, balance: a.balance + decision.amount } : a)
      break
    }

    case 'investment': {
      investments = [...investments, {
        id: 'sim-investment',
        name: decision.description,
        kind: 'fund' as const,
        currentValue: decision.amount,
        avgCost: decision.amount,
        quantity: 1,
        expectedAnnualReturn: decision.expectedReturn ?? 0.07,
      }]
      accounts = accounts.map((a, i) => i === 0 ? { ...a, balance: a.balance - decision.amount } : a)
      break
    }
  }

  return { ...snapshot, accounts, transactions, debts, investments }
}

function riskFromImpact(cashFlowDelta: number, debtRatioNew: number, savingsRateNew: number): RiskLevel {
  if (debtRatioNew > 0.5 || savingsRateNew < 0) return 'critical'
  if (debtRatioNew > 0.35 || savingsRateNew < 0.05) return 'high'
  if (debtRatioNew > 0.25 || cashFlowDelta < -0.2) return 'medium'
  return 'low'
}

function buildRecommendations(decision: Decision, cost: DecisionCost, cashFlowDelta: number): RecommendationData[] {
  const recs: RecommendationData[] = []

  if (decision.type === 'purchase' && (!decision.installments || decision.installments === 1)) {
    recs.push({ kind: 'split_cost', durationMonths: 12 })
  }

  if (cashFlowDelta < 0 && Math.abs(cashFlowDelta) > 0.1) {
    recs.push({ kind: 'reduce_expense', savingAmount: round(cost.monthlyCost * 0.3, 0) })
  }

  if (cost.isDebt && decision.interestRate && decision.interestRate > 0.1) {
    recs.push({ kind: 'alternative_payment' })
  }

  return recs
}

function buildAlternatives(decision: Decision, cost: DecisionCost): AlternativeResult[] {
  const alternatives: AlternativeResult[] = []

  if (decision.type === 'purchase' && (!decision.installments || decision.installments === 1)) {
    const months = 12
    const monthly = round(decision.amount / months, 0)
    alternatives.push({
      description: `Compra en ${months} cuotas sin interés`,
      type: 'installments_no_interest',
      monthlyCost: monthly,
      totalCost: decision.amount,
      goalImpacts: [],
      riskLevel: 'low',
    })
  }

  if (decision.type === 'purchase') {
    const partial = round(decision.amount * 0.5, 0)
    alternatives.push({
      description: 'Pagar 50% con fondos propios, 50% en cuotas',
      type: 'hybrid',
      monthlyCost: round(partial / 6, 0),
      totalCost: decision.amount,
      goalImpacts: [],
      riskLevel: 'low',
    })
  }

  return alternatives
}

// ─── SimulationEngine ────────────────────────────────────────────────────────

const PROJECTION_MONTHS = 12

/**
 * SimulationEngine — calculates the full impact of a financial decision.
 * Returns structured data only. Never text.
 */
export function simulate(snapshot: FinancialSnapshot, decision: Decision): SimulationResult {
  const cost = resolveDecisionCost(decision)
  const asOfDate = snapshot.asOf

  // Baseline: current snapshot projected forward
  const baselinePeriod = { start: asOfDate, end: addMonthsISO(asOfDate, 1) }
  const baselineCashflow = calculateCashFlow(snapshot, baselinePeriod)
  const baselineDebt = calculateDebt(snapshot, baselineCashflow.income)
  const baselineGoals = calculateGoals(snapshot, baselineCashflow.net)
  const baselineNetWorth = calculateNetWorth(snapshot)

  // Decision snapshot: snapshot with decision applied
  const decisionSnapshot = applyDecisionToSnapshot(snapshot, decision, cost)
  const decisionCashflow = calculateCashFlow(decisionSnapshot, baselinePeriod)
  const decisionDebt = calculateDebt(decisionSnapshot, decisionCashflow.income)
  const decisionGoals = calculateGoals(decisionSnapshot, decisionCashflow.net)
  const decisionNetWorth = calculateNetWorth(decisionSnapshot)

  // Feasibility: decision is not feasible if it makes cashflow deeply negative
  const feasible = decisionCashflow.net >= -(baselineCashflow.income * 0.2)
  const feasibilityReason = feasible
    ? null
    : 'La decisión genera un flujo negativo superior al 20% del ingreso mensual'

  // Cash flow impact
  const cashFlowDelta = round(decisionCashflow.net - baselineCashflow.net, 0)
  const cashFlowImpact: CashFlowImpact = {
    monthlyDelta: cashFlowDelta,
    annualDelta: round(cashFlowDelta * 12, 0),
    newMonthlyCashflow: decisionCashflow.net,
    newSavingsRate: decisionCashflow.savingsRate,
    savingsRateDelta: round(decisionCashflow.savingsRate - baselineCashflow.savingsRate, 4),
  }

  // Goal impact: compare projected completion dates
  const goalImpacts: GoalImpact[] = baselineGoals.objectives.map((baseObj) => {
    const decObj = decisionGoals.objectives.find((o) => o.id === baseObj.id)
    if (!decObj) return null
    const delay = Math.max(0, decObj.monthsRemaining - baseObj.monthsRemaining)
    return {
      goalId: baseObj.id,
      goalName: baseObj.name,
      monthsDelayed: delay,
      newProjectedDate: decObj.projectedCompletionDate,
      originalProjectedDate: baseObj.projectedCompletionDate,
      isNowUnfeasible: decObj.monthsRemaining === 9999 && baseObj.monthsRemaining !== 9999,
    }
  }).filter((x): x is GoalImpact => x !== null)

  // Debt impact (only if decision adds debt)
  const debtImpact: DebtImpact | null = cost.isDebt || cost.monthlyCost > 0
    ? {
        additionalMonthlyPayment: round(decisionDebt.totalMonthlyPayment - baselineDebt.totalMonthlyPayment, 0),
        newDebtTotal: decisionDebt.totalDebt,
        newDebtToIncomeRatio: decisionDebt.debtToIncomeRatio,
        totalInterestCost: cost.interestCost,
        newDebtFreeDate: decisionDebt.estimatedDebtFreeDate,
        riskLevelChange: decisionDebt.riskLevel,
      }
    : null

  // Net worth impact
  const immediateImpact = round(decisionNetWorth.netWorth - baselineNetWorth.netWorth, 0)
  const baselineProjection = project(snapshot, PROJECTION_MONTHS)
  const decisionProjection = project(decisionSnapshot, PROJECTION_MONTHS)

  const netWorthImpact: NetWorthImpact = {
    immediateImpact,
    impactAt12Months: round(
      (decisionProjection.summary.finalNetWorth - baselineProjection.summary.finalNetWorth),
      0
    ),
    impactAt60Months: 0, // Requires 60-month projection — expensive; left for on-demand
    isAsset: decision.type === 'investment' || decision.type === 'real_estate',
  }

  // Savings impact
  const monthlySavingsDelta = round(decisionCashflow.net - baselineCashflow.net, 0)
  const savingsImpact: SavingsImpact = {
    monthlySavingsDelta,
    annualSavingsDelta: round(monthlySavingsDelta * 12, 0),
    opportunityCost: round(cost.totalCost * 0.07, 0), // 7% opportunity cost
  }

  // Goal delays
  const delayInGoals: GoalDelay[] = goalImpacts
    .filter((g) => g.monthsDelayed > 0)
    .map((g) => ({
      goalId: g.goalId,
      goalName: g.goalName,
      originalDate: g.originalProjectedDate,
      newDate: g.newProjectedDate,
      delayMonths: g.monthsDelayed,
    }))

  // Risk level
  const riskLevel = riskFromImpact(
    cashFlowDelta / Math.abs(baselineCashflow.income || 1),
    decisionDebt.debtToIncomeRatio,
    decisionCashflow.savingsRate
  )

  const recommendationsData = buildRecommendations(
    decision,
    cost,
    cashFlowDelta / Math.abs(baselineCashflow.income || 1)
  )

  const alternatives = buildAlternatives(decision, cost)

  return {
    decision: { type: decision.type, description: decision.description, amount: decision.amount },
    feasible,
    feasibilityReason,
    monthlyCost: cost.monthlyCost,
    totalCost: cost.totalCost,
    impactOnCashFlow: cashFlowImpact,
    impactOnGoals: goalImpacts,
    impactOnDebt: debtImpact,
    impactOnNetWorth: netWorthImpact,
    impactOnSavings: savingsImpact,
    delayInGoals,
    riskLevel,
    recommendationsData,
    alternatives,
    baselineTimeline: baselineProjection.timeline,
    decisionTimeline: decisionProjection.timeline,
  }
}
