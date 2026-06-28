import { describe, it, expect } from 'vitest'
import { calculateCapacity } from '../engines/CapacityEngine'
import { calculateCashFlow } from '../engines/CashFlowEngine'
import { calculateDebt } from '../engines/DebtEngine'
import { calculateNetWorth } from '../engines/NetWorthEngine'
import { baseSnapshot, snapshotWith } from './fixtures'

const period = { start: '2026-06-01T00:00:00Z', end: '2026-06-30T23:59:59Z' }

function buildCapacity(snap = baseSnapshot) {
  const cashflow = calculateCashFlow(snap, period)
  const debt = calculateDebt(snap, cashflow.income)
  const netWorth = calculateNetWorth(snap)
  return calculateCapacity(cashflow, debt, netWorth)
}

describe('CapacityEngine', () => {
  it('calculates monthlyAvailable as net cashflow', () => {
    const result = buildCapacity()
    const cashflow = calculateCashFlow(baseSnapshot, period)
    expect(result.monthlyAvailable).toBe(cashflow.net)
  })

  it('returns positive savingsCapacity for healthy finances', () => {
    const result = buildCapacity()
    expect(result.savingsCapacity).toBeGreaterThan(0)
  })

  it('calculates additionalDebtCapacity correctly', () => {
    const result = buildCapacity()
    // income=3.5M, maxDebt=35%=1.225M, currentPayment=180k → capacity = 1.045M
    expect(result.additionalDebtCapacity).toBeGreaterThan(0)
    expect(result.additionalDebtCapacity).toBeLessThanOrEqual(3_500_000 * 0.35)
  })

  it('calculates emergency fund months from liquid assets', () => {
    const result = buildCapacity()
    // liquid=14M, expenses=1.1M → ~12.7 months
    expect(result.emergencyFundMonths).toBeGreaterThan(10)
  })

  it('returns a financial health score between 0 and 100', () => {
    const result = buildCapacity()
    expect(result.financialHealthScore).toBeGreaterThanOrEqual(0)
    expect(result.financialHealthScore).toBeLessThanOrEqual(100)
  })

  it('returns high health score for good snapshot', () => {
    const result = buildCapacity()
    expect(result.financialHealthScore).toBeGreaterThan(70)
  })

  it('returns low health score for stressed snapshot', () => {
    const snap = snapshotWith({
      accounts: [{ id: 'a1', name: 'Cuenta', kind: 'checking', balance: 50_000, isLiquid: true }],
      transactions: [
        { id: 'tx-income', accountId: 'a1', amount: 1_000_000, kind: 'income', date: '2026-06-15T00:00:00Z', isRecurring: true, recurrencePattern: 'monthly', description: 'Sueldo', tags: [] },
        { id: 'tx-exp', accountId: 'a1', amount: 950_000, kind: 'expense', date: '2026-06-15T00:00:00Z', isRecurring: true, recurrencePattern: 'monthly', description: 'Gastos', tags: [] },
      ],
      debts: [{
        id: 'd1', name: 'Deuda Alta', kind: 'personal',
        originalAmount: 5_000_000, remainingAmount: 5_000_000,
        monthlyPayment: 400_000, interestRate: 0.2,
        startDate: '2026-01-01T00:00:00Z', endDate: '2030-01-01T00:00:00Z',
      }],
    })
    const result = buildCapacity(snap)
    expect(result.financialHealthScore).toBeLessThan(50)
  })

  it('includes income in breakdown', () => {
    const result = buildCapacity()
    expect(result.breakdown.income).toBeGreaterThan(0)
  })

  it('zeroes savingsCapacity when expenses exceed income', () => {
    const snap = snapshotWith({
      transactions: [
        { id: 'tx-income', accountId: 'acc-1', amount: 500_000, kind: 'income', date: '2026-06-15T00:00:00Z', isRecurring: true, recurrencePattern: 'monthly', description: 'Sueldo', tags: [] },
        { id: 'tx-exp', accountId: 'acc-1', amount: 700_000, kind: 'expense', date: '2026-06-15T00:00:00Z', isRecurring: true, recurrencePattern: 'monthly', description: 'Gastos', tags: [] },
      ],
    })
    const result = buildCapacity(snap)
    expect(result.savingsCapacity).toBe(0)
  })
})
