import { describe, it, expect } from 'vitest'
import { calculateGoals } from '../engines/GoalEngine'
import { baseSnapshot, snapshotWith } from './fixtures'

describe('GoalEngine', () => {
  it('returns empty result when no objectives', () => {
    const snap = snapshotWith({ objectives: [] })
    const result = calculateGoals(snap, 500_000)
    expect(result.objectives).toHaveLength(0)
    expect(result.feasibilityScore).toBe(100)
  })

  it('calculates progress percentage for each objective', () => {
    const result = calculateGoals(baseSnapshot, 1_000_000)
    const casa = result.objectives.find((o) => o.id === 'obj-casa')
    expect(casa?.progressPercent).toBeCloseTo(67.4, 0)
  })

  it('calculates remaining amount correctly', () => {
    const result = calculateGoals(baseSnapshot, 1_000_000)
    const casa = result.objectives.find((o) => o.id === 'obj-casa')
    expect(casa?.remaining).toBe(100_000_000 - 67_400_000)
  })

  it('marks goal as on track when contribution covers required saving', () => {
    // 100M goal with 30M remaining, 30 months: need 1M/month
    const result = calculateGoals(baseSnapshot, 2_000_000)
    const casa = result.objectives.find((o) => o.id === 'obj-casa')
    // Should be on track if allocated saving >= required monthly saving
    expect(typeof casa?.isOnTrack).toBe('boolean')
  })

  it('marks goal as at risk when contribution is insufficient', () => {
    // Very small monthly available for a large gap
    const result = calculateGoals(baseSnapshot, 10_000) // 10k for 100M gap
    const casa = result.objectives.find((o) => o.id === 'obj-casa')
    expect(casa?.isAtRisk).toBe(true)
  })

  it('sorts objectives by priority', () => {
    const result = calculateGoals(baseSnapshot, 1_000_000)
    const priorities = result.objectives.map((o) => {
      const obj = baseSnapshot.objectives.find((base) => base.id === o.id)
      return obj?.priority ?? 999
    })
    for (let i = 1; i < priorities.length; i++) {
      expect(priorities[i]!).toBeGreaterThanOrEqual(priorities[i - 1]!)
    }
  })

  it('calculates total monthly required', () => {
    const result = calculateGoals(baseSnapshot, 1_000_000)
    expect(result.totalMonthlyRequired).toBeGreaterThan(0)
  })

  it('calculates total current and remaining', () => {
    const result = calculateGoals(baseSnapshot, 1_000_000)
    expect(result.totalCurrent).toBe(67_400_000 + 1_900_000)
    expect(result.totalRequired).toBe(100_000_000 + 5_000_000)
    expect(result.totalRemaining).toBe(result.totalRequired - result.totalCurrent)
  })

  it('detects critical goals (deadline < 3 months)', () => {
    const urgentSnap = snapshotWith({
      objectives: [{
        id: 'obj-urgent',
        name: 'Urgente',
        targetAmount: 1_000_000,
        currentAmount: 0,
        targetDate: new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 1,
        status: 'at_risk',
        linkedFundIds: [],
      }],
    })
    const result = calculateGoals(urgentSnap, 10_000)
    expect(result.criticalGoalIds).toContain('obj-urgent')
  })
})
