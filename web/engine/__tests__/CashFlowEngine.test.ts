import { describe, it, expect } from 'vitest'
import { calculateCashFlow, calculateMonthlyAverage } from '../engines/CashFlowEngine'
import { baseSnapshot, snapshotWith, NOW } from './fixtures'

const JUNE_PERIOD = { start: '2026-06-01T00:00:00Z', end: '2026-06-30T23:59:59Z' }

describe('CashFlowEngine', () => {
  describe('calculateCashFlow', () => {
    it('calculates total income correctly', () => {
      const result = calculateCashFlow(baseSnapshot, JUNE_PERIOD)
      expect(result.income).toBe(3_500_000)
    })

    it('calculates total expenses correctly', () => {
      const result = calculateCashFlow(baseSnapshot, JUNE_PERIOD)
      // Arriendo 850k + Supermercado 200k + Transporte 50k = 1_100_000
      expect(result.expenses).toBe(1_100_000)
    })

    it('calculates net correctly', () => {
      const result = calculateCashFlow(baseSnapshot, JUNE_PERIOD)
      expect(result.net).toBe(3_500_000 - 1_100_000)
    })

    it('calculates savings rate correctly', () => {
      const result = calculateCashFlow(baseSnapshot, JUNE_PERIOD)
      const expected = (3_500_000 - 1_100_000) / 3_500_000
      expect(result.savingsRate).toBeCloseTo(expected, 4)
    })

    it('identifies recurring vs one-time transactions', () => {
      const result = calculateCashFlow(baseSnapshot, JUNE_PERIOD)
      // Arriendo + Transporte are recurring = 900_000
      expect(result.recurringExpenses).toBe(900_000)
      // Supermercado is one-time
      expect(result.oneTimeExpenses).toBe(200_000)
    })

    it('returns category breakdown sorted by amount', () => {
      const result = calculateCashFlow(baseSnapshot, JUNE_PERIOD)
      expect(result.byCategory.length).toBeGreaterThan(0)
      expect(result.byCategory[0]!.amount).toBeGreaterThanOrEqual(result.byCategory[1]?.amount ?? 0)
    })

    it('identifies largest expense category', () => {
      const result = calculateCashFlow(baseSnapshot, JUNE_PERIOD)
      expect(result.largestExpenseCategory).toBe('Arriendo')
    })

    it('returns zero income when no income transactions', () => {
      const snap = snapshotWith({
        transactions: baseSnapshot.transactions.filter((t) => t.kind !== 'income'),
      })
      const result = calculateCashFlow(snap, JUNE_PERIOD)
      expect(result.income).toBe(0)
      expect(result.savingsRate).toBe(0)
    })

    it('returns zero expenses when no expense transactions', () => {
      const snap = snapshotWith({
        transactions: baseSnapshot.transactions.filter((t) => t.kind !== 'expense'),
      })
      const result = calculateCashFlow(snap, JUNE_PERIOD)
      expect(result.expenses).toBe(0)
    })

    it('filters out non-recurring transactions outside period', () => {
      // Only one-time expense on 2026-06-20 — not included in a future period
      const snap = snapshotWith({
        transactions: [
          { id: 'tx-once', accountId: 'acc-1', amount: 500_000, kind: 'expense', date: '2026-06-20T00:00:00Z', isRecurring: false, description: 'Compra única', tags: [] },
        ],
      })
      const result = calculateCashFlow(snap, {
        start: '2026-07-01T00:00:00Z',
        end: '2026-07-31T23:59:59Z',
      })
      // One-time transaction in June should not appear in July
      expect(result.expenses).toBe(0)
    })
  })

  describe('calculateMonthlyAverage', () => {
    it('returns structured result with income/expenses/net/savingsRate', () => {
      const result = calculateMonthlyAverage(baseSnapshot, 1)
      expect(result).toHaveProperty('income')
      expect(result).toHaveProperty('expenses')
      expect(result).toHaveProperty('net')
      expect(result).toHaveProperty('savingsRate')
    })

    it('net equals income minus expenses', () => {
      const result = calculateMonthlyAverage(baseSnapshot, 1)
      expect(result.net).toBe(result.income - result.expenses)
    })
  })
})
