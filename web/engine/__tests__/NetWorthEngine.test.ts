import { describe, it, expect } from 'vitest'
import { calculateNetWorth } from '../engines/NetWorthEngine'
import { baseSnapshot, snapshotWith } from './fixtures'

describe('NetWorthEngine', () => {
  it('calculates total assets correctly', () => {
    const result = calculateNetWorth(baseSnapshot)
    // accounts: 4M + 10M + 15M = 29M
    // investments: 8M
    expect(result.totalAssets).toBe(4_000_000 + 10_000_000 + 15_000_000 + 8_000_000)
  })

  it('calculates total liabilities correctly', () => {
    const result = calculateNetWorth(baseSnapshot)
    expect(result.totalLiabilities).toBe(3_200_000)
  })

  it('calculates net worth correctly', () => {
    const result = calculateNetWorth(baseSnapshot)
    const expectedAssets = 4_000_000 + 10_000_000 + 15_000_000 + 8_000_000
    expect(result.netWorth).toBe(expectedAssets - 3_200_000)
  })

  it('separates liquid from illiquid assets', () => {
    const result = calculateNetWorth(baseSnapshot)
    // Liquid: checking (4M) + savings (10M) = 14M
    expect(result.liquidAssets).toBe(14_000_000)
    // Illiquid: investment account (15M) + portfolio (8M) = 23M
    expect(result.illiquidAssets).toBe(23_000_000)
  })

  it('calculates debt-to-asset ratio', () => {
    const result = calculateNetWorth(baseSnapshot)
    expect(result.debtToAssetRatio).toBeGreaterThan(0)
    expect(result.debtToAssetRatio).toBeLessThan(1)
  })

  it('returns zero net worth with no assets', () => {
    const snap = snapshotWith({ accounts: [], investments: [], debts: [] })
    const result = calculateNetWorth(snap)
    expect(result.netWorth).toBe(0)
    expect(result.totalAssets).toBe(0)
  })

  it('returns negative net worth when liabilities exceed assets', () => {
    const snap = snapshotWith({
      accounts: [{ id: 'a1', name: 'Cuenta', kind: 'checking', balance: 100_000, isLiquid: true }],
      investments: [],
      debts: [{ id: 'd1', name: 'Deuda', kind: 'personal', originalAmount: 5_000_000, remainingAmount: 5_000_000, monthlyPayment: 100_000, interestRate: 0.1, startDate: '2026-01-01T00:00:00Z', endDate: '2030-01-01T00:00:00Z' }],
    })
    const result = calculateNetWorth(snap)
    expect(result.netWorth).toBeLessThan(0)
  })

  it('breaks down liabilities by type', () => {
    const snap = snapshotWith({
      debts: [
        { id: 'd1', name: 'Hipoteca', kind: 'mortgage', originalAmount: 50_000_000, remainingAmount: 40_000_000, monthlyPayment: 500_000, interestRate: 0.06, startDate: '2023-01-01T00:00:00Z', endDate: '2033-01-01T00:00:00Z' },
        { id: 'd2', name: 'Auto', kind: 'vehicle', originalAmount: 10_000_000, remainingAmount: 8_000_000, monthlyPayment: 200_000, interestRate: 0.08, startDate: '2024-01-01T00:00:00Z', endDate: '2029-01-01T00:00:00Z' },
      ],
    })
    const result = calculateNetWorth(snap)
    expect(result.liabilityBreakdown.mortgages).toBe(40_000_000)
    expect(result.liabilityBreakdown.vehicleLoans).toBe(8_000_000)
  })
})
