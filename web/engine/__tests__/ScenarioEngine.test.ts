import { describe, it, expect } from 'vitest'
import { compareScenarios } from '../engines/ScenarioEngine'
import { baseSnapshot } from './fixtures'

describe('ScenarioEngine', () => {
  it('returns base case and 3 default scenarios', () => {
    const result = compareScenarios(baseSnapshot, 12)
    expect(result.baseCase).toBeDefined()
    expect(result.scenarios).toHaveLength(3)
  })

  it('default scenarios are Optimista, Conservador, Crisis', () => {
    const result = compareScenarios(baseSnapshot, 12)
    const names = result.scenarios.map((s) => s.name)
    expect(names).toContain('Optimista')
    expect(names).toContain('Conservador')
    expect(names).toContain('Crisis')
  })

  it('optimistic scenario has higher net worth than crisis', () => {
    const result = compareScenarios(baseSnapshot, 12)
    const optimistic = result.scenarios.find((s) => s.type === 'optimistic')!
    const crisis = result.scenarios.find((s) => s.type === 'crisis')!
    expect(optimistic.finalNetWorth).toBeGreaterThan(crisis.finalNetWorth)
  })

  it('bestCase is Optimista', () => {
    const result = compareScenarios(baseSnapshot, 12)
    expect(result.bestCase).toBe('Optimista')
  })

  it('worstCase is Crisis', () => {
    const result = compareScenarios(baseSnapshot, 12)
    expect(result.worstCase).toBe('Crisis')
  })

  it('each scenario includes differenceFromBase', () => {
    const result = compareScenarios(baseSnapshot, 12)
    for (const scenario of result.scenarios) {
      expect(typeof scenario.differenceFromBase.netWorth).toBe('number')
      expect(typeof scenario.differenceFromBase.savings).toBe('number')
    }
  })

  it('optimistic differenceFromBase.netWorth is positive', () => {
    const result = compareScenarios(baseSnapshot, 12)
    const optimistic = result.scenarios.find((s) => s.type === 'optimistic')!
    expect(optimistic.differenceFromBase.netWorth).toBeGreaterThan(0)
  })

  it('crisis differenceFromBase.netWorth is negative', () => {
    const result = compareScenarios(baseSnapshot, 12)
    const crisis = result.scenarios.find((s) => s.type === 'crisis')!
    expect(crisis.differenceFromBase.netWorth).toBeLessThan(0)
  })

  it('accepts custom scenarios', () => {
    const result = compareScenarios(baseSnapshot, 6, [
      { name: 'MiEscenario', type: 'custom', assumptions: { incomeGrowthRate: 0.05 } },
    ])
    expect(result.scenarios).toHaveLength(1)
    expect(result.scenarios[0]!.name).toBe('MiEscenario')
    expect(result.bestCase).toBe('MiEscenario')
  })

  it('each scenario has a riskLevel', () => {
    const result = compareScenarios(baseSnapshot, 12)
    for (const scenario of result.scenarios) {
      expect(['none', 'low', 'medium', 'high', 'critical']).toContain(scenario.riskLevel)
    }
  })
})
