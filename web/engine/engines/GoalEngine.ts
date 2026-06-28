import type { FinancialSnapshot, EngineObjective } from '../types/inputs'
import type { GoalResult, ObjectiveDetail } from '../types/outputs'
import { round, percent, requiredMonthlySaving, monthsToReachTarget, score } from '../core/mathUtils'
import { monthsBetweenISO, addMonthsISO } from '../core/dateUtils'

function buildObjectiveDetail(
  obj: EngineObjective,
  asOf: string,
  monthlyContribution: number
): ObjectiveDetail {
  const remaining = Math.max(0, obj.targetAmount - obj.currentAmount)
  const progressPct = percent(obj.currentAmount, obj.targetAmount)
  const monthsUntilTarget = Math.max(0, monthsBetweenISO(asOf, obj.targetDate))
  const requiredMonthly = requiredMonthlySaving(obj.targetAmount, obj.currentAmount, monthsUntilTarget)

  // How many months at current contribution rate
  const monthsAtCurrentRate = monthsToReachTarget(obj.targetAmount, obj.currentAmount, monthlyContribution)

  const projectedDate =
    monthlyContribution > 0
      ? addMonthsISO(asOf, monthsAtCurrentRate === Infinity ? 9999 : monthsAtCurrentRate)
      : addMonthsISO(asOf, 9999)

  const isOnTrack = monthlyContribution >= requiredMonthly && monthsAtCurrentRate <= monthsUntilTarget
  const isAtRisk = !isOnTrack && remaining > 0

  const surplusOrDeficit = round(monthlyContribution - requiredMonthly, 0)

  return {
    id: obj.id,
    name: obj.name,
    targetAmount: obj.targetAmount,
    currentAmount: obj.currentAmount,
    remaining: round(remaining, 0),
    progressPercent: progressPct,
    targetDate: obj.targetDate,
    projectedCompletionDate: projectedDate,
    monthsRemaining: monthsAtCurrentRate === Infinity ? 9999 : monthsAtCurrentRate,
    monthsUntilTarget,
    requiredMonthlySaving: round(requiredMonthly, 0),
    currentMonthlySaving: round(monthlyContribution, 0),
    isOnTrack,
    isAtRisk,
    surplusOrDeficit,
  }
}

/**
 * GoalEngine — evaluates objective progress, feasibility, and conflicts.
 * monthlyAvailable is the total free capital that can be distributed across goals.
 */
export function calculateGoals(
  snapshot: FinancialSnapshot,
  monthlyAvailable: number
): GoalResult {
  const { objectives, asOf } = snapshot

  if (objectives.length === 0) {
    return {
      objectives: [],
      totalRequired: 0,
      totalCurrent: 0,
      totalRemaining: 0,
      totalMonthlyRequired: 0,
      feasibilityScore: 100,
      conflictingGoalIds: [],
      criticalGoalIds: [],
    }
  }

  // Sort by priority (lower number = higher priority)
  const sorted = [...objectives].sort((a, b) => a.priority - b.priority)

  // Distribute available capital by priority
  let remaining = monthlyAvailable
  const contributionMap = new Map<string, number>()
  for (const obj of sorted) {
    const monthsLeft = Math.max(1, monthsBetweenISO(asOf, obj.targetDate))
    const needed = requiredMonthlySaving(obj.targetAmount, obj.currentAmount, monthsLeft)
    const allocated = Math.min(remaining, needed)
    contributionMap.set(obj.id, allocated)
    remaining = Math.max(0, remaining - allocated)
  }

  const details = sorted.map((obj) =>
    buildObjectiveDetail(obj, asOf, contributionMap.get(obj.id) ?? 0)
  )

  const totalRequired = round(objectives.reduce((s, o) => s + o.targetAmount, 0), 0)
  const totalCurrent = round(objectives.reduce((s, o) => s + o.currentAmount, 0), 0)
  const totalRemaining = round(totalRequired - totalCurrent, 0)
  const totalMonthlyRequired = round(details.reduce((s, d) => s + d.requiredMonthlySaving, 0), 0)

  // Feasibility: 100 if all on track, decreases for each at-risk goal weighted by priority
  const atRiskCount = details.filter((d) => d.isAtRisk).length
  const feasibilityScore = score(100 - (atRiskCount / details.length) * 100)

  const conflictingGoalIds = details
    .filter((d) => d.isAtRisk && totalMonthlyRequired > monthlyAvailable)
    .map((d) => d.id)

  const criticalGoalIds = details
    .filter((d) => d.isAtRisk && d.monthsUntilTarget <= 3)
    .map((d) => d.id)

  return {
    objectives: details,
    totalRequired,
    totalCurrent,
    totalRemaining,
    totalMonthlyRequired,
    feasibilityScore,
    conflictingGoalIds,
    criticalGoalIds,
  }
}
