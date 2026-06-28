import { describe, it, expect } from 'vitest'
import { KumbreEngine } from '../KumbreEngine'
import { baseSnapshot } from './fixtures'
import type { Decision } from '../types/inputs'

const NOW = baseSnapshot.asOf

describe('KumbreEngine (integration)', () => {
  it('constructs without errors', () => {
    const engine = new KumbreEngine(baseSnapshot)
    expect(engine).toBeDefined()
  })

  it('analyze() returns all sub-results', () => {
    const engine = new KumbreEngine(baseSnapshot)
    const result = engine.analyze()
    expect(result.cashflow).toBeDefined()
    expect(result.netWorth).toBeDefined()
    expect(result.debt).toBeDefined()
    expect(result.goals).toBeDefined()
    expect(result.funds).toBeDefined()
    expect(result.capacity).toBeDefined()
    expect(result.rules).toBeDefined()
  })

  it('analyze() results are internally consistent', () => {
    const engine = new KumbreEngine(baseSnapshot)
    const result = engine.analyze()
    // Total assets should be positive
    expect(result.netWorth.totalAssets).toBeGreaterThan(0)
    // Debt total matches payments-based calculation
    expect(result.debt.totalDebt).toBe(3_200_000)
    // Financial health score > 0
    expect(result.capacity.financialHealthScore).toBeGreaterThan(0)
  })

  it('netWorth() standalone method works', () => {
    const engine = new KumbreEngine(baseSnapshot)
    const result = engine.netWorth()
    expect(result.netWorth).toBeGreaterThan(0)
  })

  it('cashFlow() for a given period works', () => {
    const engine = new KumbreEngine(baseSnapshot)
    const result = engine.cashFlow({ start: '2026-06-01T00:00:00Z', end: '2026-06-30T23:59:59Z' })
    expect(result.income).toBeGreaterThan(0)
  })

  it('project() returns timeline', () => {
    const engine = new KumbreEngine(baseSnapshot)
    const result = engine.project(6)
    expect(result.timeline).toHaveLength(6)
  })

  it('simulate() returns structured result', () => {
    const engine = new KumbreEngine(baseSnapshot)
    const decision: Decision = {
      type: 'purchase',
      description: 'Bicicleta',
      amount: 300_000,
      startDate: NOW,
    }
    const result = engine.simulate(decision)
    expect(result.feasible).toBe(true)
    expect(result.totalCost).toBe(300_000)
  })

  it('compareScenarios() returns 3 default scenarios', () => {
    const engine = new KumbreEngine(baseSnapshot)
    const result = engine.compareScenarios(6)
    expect(result.scenarios).toHaveLength(3)
  })

  it('evaluateRules() returns compliant result for base snapshot', () => {
    const engine = new KumbreEngine(baseSnapshot)
    const result = engine.evaluateRules()
    // base snapshot has good savings rate and low DTI — should be compliant
    expect(result.compliant).toBe(true)
  })

  it('withSnapshot() returns a new independent engine', () => {
    const engine = new KumbreEngine(baseSnapshot)
    const updated = engine.withSnapshot({ ...baseSnapshot, asOf: '2027-01-01T00:00:00Z' })
    expect(updated).not.toBe(engine)
    expect(updated.netWorth().netWorth).toBeDefined()
  })

  it('chaining simulate → project is consistent', () => {
    const engine = new KumbreEngine(baseSnapshot)
    // First get baseline 12m projection
    const baseline = engine.project(12)
    // Then simulate a large recurring expense
    const decision: Decision = {
      type: 'recurring_expense',
      description: 'Nuevo empleado',
      amount: 500_000,
      monthlyAmount: 500_000,
      durationMonths: 12,
      startDate: NOW,
    }
    const sim = engine.simulate(decision)
    // 12m savings in decision timeline should be less than baseline
    const baselineFinalSavings = baseline.summary.totalSaved
    const decisionFinalSavings = sim.decisionTimeline.reduce((s, p) => s + p.cashflow.net, 0)
    expect(decisionFinalSavings).toBeLessThan(baselineFinalSavings)
  })
})
