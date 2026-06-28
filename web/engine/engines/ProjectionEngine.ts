import type { FinancialSnapshot, EngineTransaction, Assumptions } from '../types/inputs'
import type { ProjectionResult, ProjectionSummary, TimelinePoint, CashFlowResult } from '../types/outputs'
import { round } from '../core/mathUtils'
import { addMonthsISO, toISOMonth, addMonths, parseDate } from '../core/dateUtils'
import { calculateCashFlow } from './CashFlowEngine'
import { calculateNetWorth } from './NetWorthEngine'
import { calculateDebt } from './DebtEngine'
import { calculateGoals } from './GoalEngine'
import { calculateFunds } from './FundEngine'
import { calculateCapacity } from './CapacityEngine'

const DEFAULT_ASSUMPTIONS: Assumptions = {
  incomeGrowthRate: 0,
  expenseGrowthRate: 0,
  investmentReturnRate: 0.06,
  inflationRate: 0.03,
}

/**
 * Apply assumptions to modify a snapshot for a given month offset.
 * This projects how financial state changes over time.
 */
function applyAssumptions(
  snapshot: FinancialSnapshot,
  monthIndex: number,
  assumptions: Assumptions
): FinancialSnapshot {
  const a = { ...DEFAULT_ASSUMPTIONS, ...assumptions }
  const monthlyIncomeGrowth = (a.incomeGrowthRate ?? 0) / 12
  const monthlyExpenseGrowth = (a.expenseGrowthRate ?? 0) / 12
  const monthlyInvestmentReturn = (a.investmentReturnRate ?? 0.06) / 12

  // Scale transaction amounts based on growth rates
  const scaledTransactions: EngineTransaction[] = snapshot.transactions.map((tx) => ({
    ...tx,
    amount:
      tx.kind === 'income'
        ? round(tx.amount * Math.pow(1 + monthlyIncomeGrowth, monthIndex), 0)
        : round(tx.amount * Math.pow(1 + monthlyExpenseGrowth, monthIndex), 0),
  }))

  // Scale investment values
  const scaledInvestments = snapshot.investments.map((inv) => ({
    ...inv,
    currentValue: round(inv.currentValue * Math.pow(1 + monthlyInvestmentReturn, monthIndex), 0),
  }))

  return {
    ...snapshot,
    transactions: scaledTransactions,
    investments: scaledInvestments,
  }
}

function buildTimelinePoint(
  snapshot: FinancialSnapshot,
  monthIndex: number,
  cumulativeSavings: number,
  assumptions: Assumptions
): TimelinePoint {
  const projected = applyAssumptions(snapshot, monthIndex, assumptions)
  const date = addMonthsISO(snapshot.asOf, monthIndex)

  const periodStart = date
  const periodEnd = addMonthsISO(date, 1)

  const cashflow = calculateCashFlow(projected, { start: periodStart, end: periodEnd })
  const netWorth = calculateNetWorth(projected)
  const debt = calculateDebt(projected, cashflow.income)
  const goals = calculateGoals(projected, cashflow.net)
  const funds = calculateFunds(projected, cashflow.income, cashflow.net)
  const capacity = calculateCapacity(cashflow, debt, netWorth, projected.rules)

  return {
    date,
    monthIndex,
    cashflow,
    netWorth,
    goals,
    funds,
    capacity,
    cumulativeSavings: round(cumulativeSavings + cashflow.net, 0),
  }
}

/**
 * ProjectionEngine — builds a month-by-month financial timeline.
 * Supports 1, 3, 6, 12, 24, 60 month projections.
 */
export function project(
  snapshot: FinancialSnapshot,
  months: number,
  assumptions: Assumptions = {}
): ProjectionResult {
  const startDate = snapshot.asOf
  const endDate = addMonthsISO(startDate, months)

  const timeline: TimelinePoint[] = []
  let cumulativeSavings = 0

  for (let i = 0; i < months; i++) {
    const point = buildTimelinePoint(snapshot, i, cumulativeSavings, assumptions)
    cumulativeSavings = point.cumulativeSavings
    timeline.push(point)
  }

  // Summary
  const firstPoint = timeline[0]
  const lastPoint = timeline[timeline.length - 1]

  const initialNetWorth = firstPoint?.netWorth.netWorth ?? 0
  const finalNetWorth = lastPoint?.netWorth.netWorth ?? 0
  const netWorthGrowth = round(finalNetWorth - initialNetWorth, 0)
  const netWorthGrowthPercent = initialNetWorth !== 0
    ? round((netWorthGrowth / Math.abs(initialNetWorth)) * 100, 2)
    : 0

  const totalIncome = round(timeline.reduce((s, p) => s + p.cashflow.income, 0), 0)
  const totalExpenses = round(timeline.reduce((s, p) => s + p.cashflow.expenses, 0), 0)
  const totalSaved = round(cumulativeSavings, 0)

  const avgSavingsRate = totalIncome > 0 ? round(totalSaved / totalIncome, 4) : 0

  // Goal feasibility across projection
  const allGoalIds = new Set(snapshot.objectives.map((o) => o.id))
  const atRiskIds = new Set(lastPoint?.goals.conflictingGoalIds ?? [])
  const goalsAchievable = Array.from(allGoalIds).filter((id) => !atRiskIds.has(id))
  const goalsAtRisk = Array.from(atRiskIds)

  const summary: ProjectionSummary = {
    finalNetWorth,
    netWorthGrowth,
    netWorthGrowthPercent,
    totalSaved,
    totalIncome,
    totalExpenses,
    goalsAchievable,
    goalsAtRisk,
    projectedSavingsRate: avgSavingsRate,
  }

  return { months, startDate, endDate, timeline, summary }
}
