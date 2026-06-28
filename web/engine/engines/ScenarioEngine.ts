import type { FinancialSnapshot, Assumptions, SCENARIO_PRESETS } from '../types/inputs'
import type { ScenarioResult, ScenarioComparison, RiskLevel } from '../types/outputs'
import { round } from '../core/mathUtils'
import { project } from './ProjectionEngine'
import { SCENARIO_PRESETS as PRESETS } from '../types/inputs'

export interface ScenarioInput {
  name: string
  type: string
  assumptions: Assumptions
}

function riskFromNetWorthGrowth(growthPercent: number): RiskLevel {
  if (growthPercent >= 10) return 'low'
  if (growthPercent >= 0) return 'medium'
  if (growthPercent >= -15) return 'high'
  return 'critical'
}

/**
 * ScenarioEngine — runs multiple projection scenarios against the same snapshot.
 * Returns a structured comparison of all scenarios vs the base case.
 */
export function compareScenarios(
  snapshot: FinancialSnapshot,
  months: number,
  scenarios: ScenarioInput[] = []
): ScenarioResult {
  // Base case: no assumptions applied
  const baseCase = project(snapshot, months, {})

  // Default scenarios if none provided
  const inputScenarios: ScenarioInput[] =
    scenarios.length > 0
      ? scenarios
      : [
          { name: 'Optimista', type: 'optimistic', assumptions: PRESETS.optimistic ?? {} },
          { name: 'Conservador', type: 'conservative', assumptions: PRESETS.conservative ?? {} },
          { name: 'Crisis', type: 'crisis', assumptions: PRESETS.crisis ?? {} },
        ]

  const comparisons: ScenarioComparison[] = inputScenarios.map((scenario) => {
    const result = project(snapshot, months, scenario.assumptions)
    const finalNetWorth = result.summary.finalNetWorth
    const baseFinal = baseCase.summary.finalNetWorth
    const netWorthDelta = round(finalNetWorth - baseFinal, 0)
    const netWorthDeltaPercent =
      baseFinal !== 0 ? round((netWorthDelta / Math.abs(baseFinal)) * 100, 2) : 0

    return {
      name: scenario.name,
      type: scenario.type,
      finalNetWorth,
      totalSaved: result.summary.totalSaved,
      goalsAchievable: result.summary.goalsAchievable,
      goalsAtRisk: result.summary.goalsAtRisk,
      riskLevel: riskFromNetWorthGrowth(result.summary.netWorthGrowthPercent),
      timeline: result.timeline,
      differenceFromBase: {
        netWorth: netWorthDelta,
        savings: round(result.summary.totalSaved - baseCase.summary.totalSaved, 0),
        netWorthPercent: netWorthDeltaPercent,
      },
    }
  })

  const bestCase = comparisons.reduce((best, s) =>
    s.finalNetWorth > best.finalNetWorth ? s : best
  ).name

  const worstCase = comparisons.reduce((worst, s) =>
    s.finalNetWorth < worst.finalNetWorth ? s : worst
  ).name

  return {
    baseCase,
    scenarios: comparisons,
    bestCase,
    worstCase,
  }
}
