import type { FinancialSnapshot, EngineTransaction } from '../types/inputs'
import type { CashFlowResult, CategoryBreakdown } from '../types/outputs'
import { round, percent } from '../core/mathUtils'
import { parseDate, startOfMonth, endOfMonth } from '../core/dateUtils'

export interface CashFlowPeriod {
  start: string
  end: string
}

/**
 * Filter transactions to those that fall within a period.
 */
function filterByPeriod(transactions: EngineTransaction[], period: CashFlowPeriod): EngineTransaction[] {
  const start = parseDate(period.start).getTime()
  const end = parseDate(period.end).getTime()
  return transactions.filter((tx) => {
    const d = parseDate(tx.date).getTime()
    return d >= start && d <= end
  })
}

/**
 * Expand recurring transactions across a period.
 * A monthly recurring transaction that falls before the period is projected forward.
 */
function expandRecurring(
  recurring: EngineTransaction[],
  period: CashFlowPeriod
): EngineTransaction[] {
  const expanded: EngineTransaction[] = []
  const periodStart = parseDate(period.start)
  const periodEnd = parseDate(period.end)

  for (const tx of recurring) {
    if (tx.frequency === 'monthly') {
      const origin = parseDate(tx.date)
      const current = new Date(periodStart.getFullYear(), periodStart.getMonth(), origin.getDate())
      while (current <= periodEnd) {
        if (current >= periodStart) {
          expanded.push({ ...tx, date: current.toISOString(), id: `${tx.id}_${current.getTime()}` })
        }
        current.setMonth(current.getMonth() + 1)
      }
    } else if (tx.frequency === 'yearly') {
      const origin = parseDate(tx.date)
      const year = periodStart.getFullYear()
      const candidate = new Date(year, origin.getMonth(), origin.getDate())
      if (candidate >= periodStart && candidate <= periodEnd) {
        expanded.push({ ...tx, date: candidate.toISOString(), id: `${tx.id}_yearly` })
      }
    }
  }
  return expanded
}

function buildCategoryBreakdowns(transactions: EngineTransaction[], total: number): CategoryBreakdown[] {
  const map = new Map<string, { name: string; amount: number; count: number }>()

  for (const tx of transactions) {
    const key = tx.categoryId ?? 'uncategorized'
    const name = tx.categoryName ?? 'Sin categoría'
    const existing = map.get(key) ?? { name, amount: 0, count: 0 }
    map.set(key, { name, amount: existing.amount + tx.amount, count: existing.count + 1 })
  }

  return Array.from(map.entries())
    .map(([categoryId, { name, amount, count }]) => ({
      categoryId,
      categoryName: name,
      amount: round(amount, 0),
      percentage: percent(amount, total),
      transactionCount: count,
    }))
    .sort((a, b) => b.amount - a.amount)
}

/**
 * CashFlowEngine — calculates income, expenses, net, savings rate, and breakdowns
 * for a given period using actual + recurring transactions.
 */
export function calculateCashFlow(
  snapshot: FinancialSnapshot,
  period: CashFlowPeriod
): CashFlowResult {
  const actual = filterByPeriod(snapshot.transactions, period)
  const recurring = snapshot.transactions.filter((tx) => tx.isRecurring && tx.frequency)
  const projected = expandRecurring(recurring, period)

  // Merge: actual transactions + recurring not already present
  const actualIds = new Set(snapshot.transactions.map((t) => t.id))
  const merged = [
    ...actual,
    ...projected.filter((t) => {
      const base = t.id.split('_')[0]
      return !actual.some((a) => a.id === base || a.id === t.id)
    }),
  ]

  const incomeTransactions = merged.filter((tx) => tx.kind === 'income')
  const expenseTransactions = merged.filter((tx) => tx.kind === 'expense')

  const income = round(incomeTransactions.reduce((s, tx) => s + tx.amount, 0), 0)
  const expenses = round(expenseTransactions.reduce((s, tx) => s + tx.amount, 0), 0)
  const net = round(income - expenses, 0)
  const savingsRate = income > 0 ? round(net / income, 4) : 0

  const recurringIncome = round(
    incomeTransactions.filter((t) => t.isRecurring).reduce((s, t) => s + t.amount, 0),
    0
  )
  const recurringExpenses = round(
    expenseTransactions.filter((t) => t.isRecurring).reduce((s, t) => s + t.amount, 0),
    0
  )

  const expenseBreakdown = buildCategoryBreakdowns(expenseTransactions, expenses)

  return {
    period,
    income,
    expenses,
    net,
    savingsRate,
    byCategory: expenseBreakdown,
    recurringIncome,
    recurringExpenses,
    oneTimeIncome: round(income - recurringIncome, 0),
    oneTimeExpenses: round(expenses - recurringExpenses, 0),
    largestExpenseCategory: expenseBreakdown[0]?.categoryName ?? null,
  }
}

/**
 * Calculate the typical monthly cashflow from the last N months of transactions.
 * Used by engines that need a "baseline" monthly figure.
 */
export function calculateMonthlyAverage(
  snapshot: FinancialSnapshot,
  lookbackMonths = 3
): { income: number; expenses: number; net: number; savingsRate: number } {
  const end = new Date(snapshot.asOf)
  const start = new Date(end)
  start.setMonth(start.getMonth() - lookbackMonths)

  const period: CashFlowPeriod = {
    start: startOfMonth(start).toISOString(),
    end: endOfMonth(end).toISOString(),
  }

  const cf = calculateCashFlow(snapshot, period)

  return {
    income: round(cf.income / lookbackMonths, 0),
    expenses: round(cf.expenses / lookbackMonths, 0),
    net: round(cf.net / lookbackMonths, 0),
    savingsRate: cf.savingsRate,
  }
}
