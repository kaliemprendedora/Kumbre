import { describe, it, expect } from 'vitest'
import { calculateFunds } from '../engines/FundEngine'
import { baseSnapshot, snapshotWith } from './fixtures'

const INCOME = 3_500_000
const AVAILABLE = 2_400_000

describe('FundEngine', () => {
  it('returns empty result when no funds', () => {
    const snap = snapshotWith({ funds: [] })
    const result = calculateFunds(snap, INCOME, AVAILABLE)
    expect(result.allocations).toHaveLength(0)
    expect(result.remainingAfterAllocations).toBe(AVAILABLE)
    expect(result.coverageScore).toBe(0)
  })

  it('calculates on_income allocation correctly', () => {
    // Fund 1: 20% of income = 700_000, Fund 2: 5% of income = 175_000
    const result = calculateFunds(baseSnapshot, INCOME, AVAILABLE)
    const fund1 = result.allocations.find((a) => a.fundId === 'fund-1')
    expect(fund1?.monthlyContribution).toBe(700_000)
  })

  it('calculates total monthly contribution', () => {
    const result = calculateFunds(baseSnapshot, INCOME, AVAILABLE)
    // 20% + 5% = 25% of 3.5M = 875_000
    expect(result.totalMonthlyContribution).toBe(875_000)
  })

  it('calculates remaining after allocations', () => {
    const result = calculateFunds(baseSnapshot, INCOME, AVAILABLE)
    expect(result.remainingAfterAllocations).toBe(AVAILABLE - 875_000)
  })

  it('calculates progress percentage for funds with target', () => {
    const result = calculateFunds(baseSnapshot, INCOME, AVAILABLE)
    const fund1 = result.allocations.find((a) => a.fundId === 'fund-1')
    // 67.4M / 100M = 67.4%
    expect(fund1?.progressPercent).toBeCloseTo(67.4, 0)
  })

  it('calculates coverage score based on objectives covered', () => {
    const result = calculateFunds(baseSnapshot, INCOME, AVAILABLE)
    // Both objectives have linked funds → coverage = 100
    expect(result.coverageScore).toBe(100)
  })

  it('handles fixed_monthly allocation rule', () => {
    const snap = snapshotWith({
      funds: [{
        id: 'fund-fixed',
        name: 'Fondo Fijo',
        currentAmount: 500_000,
        targetAmount: 5_000_000,
        objectiveIds: [],
        allocationRule: { trigger: 'fixed_monthly', fixedAmount: 200_000 },
      }],
    })
    const result = calculateFunds(snap, INCOME, AVAILABLE)
    expect(result.allocations[0]?.monthlyContribution).toBe(200_000)
  })

  it('handles on_surplus allocation rule', () => {
    const snap = snapshotWith({
      funds: [{
        id: 'fund-surplus',
        name: 'Fondo Excedente',
        currentAmount: 0,
        objectiveIds: [],
        allocationRule: { trigger: 'on_surplus', percentage: 0.5 },
      }],
    })
    const result = calculateFunds(snap, INCOME, AVAILABLE)
    expect(result.allocations[0]?.monthlyContribution).toBe(AVAILABLE * 0.5)
  })
})
