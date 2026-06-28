import { describe, it, expect } from 'vitest'
import { calculateDebt } from '../engines/DebtEngine'
import { baseSnapshot, snapshotWith } from './fixtures'

const MONTHLY_INCOME = 3_500_000

describe('DebtEngine', () => {
  it('calculates total debt correctly', () => {
    const result = calculateDebt(baseSnapshot, MONTHLY_INCOME)
    expect(result.totalDebt).toBe(3_200_000)
  })

  it('calculates monthly payment correctly', () => {
    const result = calculateDebt(baseSnapshot, MONTHLY_INCOME)
    expect(result.totalMonthlyPayment).toBe(180_000)
  })

  it('calculates debt-to-income ratio', () => {
    const result = calculateDebt(baseSnapshot, MONTHLY_INCOME)
    expect(result.debtToIncomeRatio).toBeCloseTo(180_000 / 3_500_000, 4)
  })

  it('assigns low risk level for small DTI', () => {
    const result = calculateDebt(baseSnapshot, MONTHLY_INCOME)
    expect(result.riskLevel).toBe('low')
  })

  it('assigns critical risk for DTI > 50%', () => {
    const snap = snapshotWith({
      debts: [{
        id: 'd1', name: 'Mega Deuda', kind: 'personal',
        originalAmount: 10_000_000, remainingAmount: 10_000_000,
        monthlyPayment: 2_000_000, // 57% of income
        interestRate: 0.15,
        startDate: '2026-01-01T00:00:00Z', endDate: '2031-01-01T00:00:00Z',
      }],
    })
    const result = calculateDebt(snap, MONTHLY_INCOME)
    expect(result.riskLevel).toBe('critical')
  })

  it('returns none risk level with no debts', () => {
    const snap = snapshotWith({ debts: [] })
    const result = calculateDebt(snap, MONTHLY_INCOME)
    expect(result.riskLevel).toBe('none')
    expect(result.totalDebt).toBe(0)
  })

  it('identifies highest interest debt', () => {
    const snap = snapshotWith({
      debts: [
        { id: 'd1', name: 'Deuda A', kind: 'personal', originalAmount: 1_000_000, remainingAmount: 1_000_000, monthlyPayment: 50_000, interestRate: 0.08, startDate: '2026-01-01T00:00:00Z', endDate: '2028-01-01T00:00:00Z' },
        { id: 'd2', name: 'Deuda B', kind: 'credit_card', originalAmount: 500_000, remainingAmount: 500_000, monthlyPayment: 30_000, interestRate: 0.24, startDate: '2026-01-01T00:00:00Z', endDate: '2027-01-01T00:00:00Z' },
      ],
    })
    const result = calculateDebt(snap, MONTHLY_INCOME)
    expect(result.highestInterestDebt).toBe('Deuda B')
  })

  it('provides remaining months for each debt', () => {
    const result = calculateDebt(baseSnapshot, MONTHLY_INCOME)
    expect(result.debts[0]?.remainingMonths).toBeGreaterThan(0)
  })

  it('returns empty debts array when no debts', () => {
    const snap = snapshotWith({ debts: [] })
    const result = calculateDebt(snap, MONTHLY_INCOME)
    expect(result.debts).toHaveLength(0)
  })
})
