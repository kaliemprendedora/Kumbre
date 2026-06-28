import { describe, it, expect } from 'vitest'
import { project } from '../engines/ProjectionEngine'
import { baseSnapshot } from './fixtures'

describe('ProjectionEngine', () => {
  it('returns timeline with correct number of points', () => {
    const result = project(baseSnapshot, 6)
    expect(result.timeline).toHaveLength(6)
    expect(result.months).toBe(6)
  })

  it('builds timeline with all engine outputs per point', () => {
    const result = project(baseSnapshot, 3)
    const point = result.timeline[0]!
    expect(point.cashflow).toBeDefined()
    expect(point.netWorth).toBeDefined()
    expect(point.goals).toBeDefined()
    expect(point.funds).toBeDefined()
    expect(point.capacity).toBeDefined()
  })

  it('cumulative savings increases monotonically for positive cashflow', () => {
    const result = project(baseSnapshot, 6)
    for (let i = 1; i < result.timeline.length; i++) {
      expect(result.timeline[i]!.cumulativeSavings).toBeGreaterThan(
        result.timeline[i - 1]!.cumulativeSavings
      )
    }
  })

  it('summary contains finalNetWorth', () => {
    const result = project(baseSnapshot, 6)
    expect(typeof result.summary.finalNetWorth).toBe('number')
  })

  it('summary totalSaved matches last point cumulativeSavings', () => {
    const result = project(baseSnapshot, 6)
    const lastPoint = result.timeline[result.timeline.length - 1]!
    expect(result.summary.totalSaved).toBe(lastPoint.cumulativeSavings)
  })

  it('applies income growth assumption', () => {
    const flat = project(baseSnapshot, 12, { incomeGrowthRate: 0 })
    const growing = project(baseSnapshot, 12, { incomeGrowthRate: 0.1 })
    expect(growing.summary.totalSaved).toBeGreaterThan(flat.summary.totalSaved)
  })

  it('applies expense growth assumption (negative effect)', () => {
    const flat = project(baseSnapshot, 12, { expenseGrowthRate: 0 })
    const costly = project(baseSnapshot, 12, { expenseGrowthRate: 0.2 })
    expect(costly.summary.totalSaved).toBeLessThan(flat.summary.totalSaved)
  })

  it('investment return grows investments over time', () => {
    const result = project(baseSnapshot, 12, { investmentReturnRate: 0.12 })
    const firstNetWorth = result.timeline[0]!.netWorth.netWorth
    const lastNetWorth = result.timeline[result.timeline.length - 1]!.netWorth.netWorth
    expect(lastNetWorth).toBeGreaterThan(firstNetWorth)
  })

  it('provides startDate and endDate', () => {
    const result = project(baseSnapshot, 12)
    expect(result.startDate).toBe(baseSnapshot.asOf)
    expect(result.endDate).toBeDefined()
  })

  it('works for 60-month projection', () => {
    const result = project(baseSnapshot, 60)
    expect(result.timeline).toHaveLength(60)
    expect(result.summary.totalIncome).toBeGreaterThan(0)
  })
})
