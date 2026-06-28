import type { FinancialSnapshot } from '../types/inputs'
import type { FundResult, FundAllocation } from '../types/outputs'
import { round, percent, score } from '../core/mathUtils'

/**
 * FundEngine — calculates fund contributions, coverage, and remaining capital.
 */
export function calculateFunds(
  snapshot: FinancialSnapshot,
  monthlyIncome: number,
  availableAfterExpenses: number
): FundResult {
  const { funds } = snapshot

  if (funds.length === 0) {
    return {
      allocations: [],
      totalCurrentAmount: 0,
      totalMonthlyContribution: 0,
      remainingAfterAllocations: availableAfterExpenses,
      coverageScore: 0,
    }
  }

  const allocations: FundAllocation[] = []
  let totalMonthlyContribution = 0

  for (const fund of funds) {
    const rule = fund.allocationRule
    let monthlyContribution = 0

    if (rule.trigger === 'on_income' && rule.percentage !== undefined) {
      monthlyContribution = round(monthlyIncome * rule.percentage, 0)
    } else if (rule.trigger === 'fixed_monthly' && rule.fixedAmount !== undefined) {
      monthlyContribution = rule.fixedAmount
    } else if (rule.trigger === 'on_surplus' && rule.percentage !== undefined) {
      monthlyContribution = round(availableAfterExpenses * rule.percentage, 0)
    }

    const targetAmount = fund.targetAmount ?? null
    const progressPct = targetAmount ? percent(fund.currentAmount, targetAmount) : 0

    allocations.push({
      fundId: fund.id,
      fundName: fund.name,
      currentAmount: round(fund.currentAmount, 0),
      monthlyContribution,
      targetAmount,
      progressPercent: progressPct,
      linkedObjectiveIds: fund.objectiveIds,
    })

    totalMonthlyContribution += monthlyContribution
  }

  totalMonthlyContribution = round(totalMonthlyContribution, 0)
  const totalCurrentAmount = round(funds.reduce((s, f) => s + f.currentAmount, 0), 0)
  const remainingAfterAllocations = round(availableAfterExpenses - totalMonthlyContribution, 0)

  // Coverage score: how many objectives have linked funds that are on track
  const coveredObjectiveIds = new Set(funds.flatMap((f) => f.objectiveIds))
  const totalObjectives = snapshot.objectives.length
  const coverageScore =
    totalObjectives > 0
      ? score((coveredObjectiveIds.size / totalObjectives) * 100)
      : 100

  return {
    allocations,
    totalCurrentAmount,
    totalMonthlyContribution,
    remainingAfterAllocations,
    coverageScore,
  }
}
