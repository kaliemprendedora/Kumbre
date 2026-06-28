import { describe, it, expect } from 'vitest'
import { evaluateRules } from '../engines/RuleEngine'
import { calculateCashFlow } from '../engines/CashFlowEngine'
import { calculateDebt } from '../engines/DebtEngine'
import { calculateNetWorth } from '../engines/NetWorthEngine'
import { baseSnapshot, snapshotWith } from './fixtures'
import type { Rule } from '../types/inputs'
import type { CashFlowResult, DebtResult, NetWorthResult } from '../types/outputs'

function buildContext(snap = baseSnapshot) {
  const period = { start: '2026-06-01T00:00:00Z', end: '2026-06-30T23:59:59Z' }
  const cashflow = calculateCashFlow(snap, period)
  const debt = calculateDebt(snap, cashflow.income)
  const netWorth = calculateNetWorth(snap)
  return { cashflow, debt, netWorth }
}

describe('RuleEngine', () => {
  it('returns compliant=true and score=100 with no rules', () => {
    const result = evaluateRules([], buildContext())
    expect(result.compliant).toBe(true)
    expect(result.score).toBe(100)
    expect(result.violations).toHaveLength(0)
  })

  it('passes min_savings_rate when savings rate is above threshold', () => {
    const rule: Rule = { id: 'r1', kind: 'min_savings_rate', label: 'Ahorro 20%', value: 0.20, priority: 'high', enabled: true }
    // base cashflow: (3.5M - 1.1M) / 3.5M ≈ 68% savings rate — passes
    const result = evaluateRules([rule], buildContext())
    expect(result.violations).toHaveLength(0)
  })

  it('violates min_savings_rate when savings rate is below threshold', () => {
    // Modify snapshot so expenses are very high
    const snap = snapshotWith({
      transactions: [
        ...baseSnapshot.transactions,
        { id: 'tx-big', accountId: 'acc-1', amount: 3_000_000, kind: 'expense', date: '2026-06-20T00:00:00Z', isRecurring: false, description: 'Gasto enorme', tags: [] },
      ],
    })
    const rule: Rule = { id: 'r1', kind: 'min_savings_rate', label: 'Ahorro 20%', value: 0.20, priority: 'high', enabled: true }
    const result = evaluateRules([rule], buildContext(snap))
    expect(result.violations.some((v) => v.ruleKind === 'min_savings_rate')).toBe(true)
    expect(result.compliant).toBe(false)
  })

  it('passes max_debt_to_income for low DTI', () => {
    const rule: Rule = { id: 'r2', kind: 'max_debt_to_income', label: 'DTI máx 35%', value: 0.35, priority: 'critical', enabled: true }
    // base DTI ≈ 5% — passes
    const result = evaluateRules([rule], buildContext())
    expect(result.violations).toHaveLength(0)
  })

  it('violates max_debt_to_income for high DTI', () => {
    const snap = snapshotWith({
      debts: [{
        id: 'd-high', name: 'Deuda Alta', kind: 'personal',
        originalAmount: 10_000_000, remainingAmount: 10_000_000,
        monthlyPayment: 1_500_000, // ~43% of income
        interestRate: 0.12,
        startDate: '2026-01-01T00:00:00Z', endDate: '2032-01-01T00:00:00Z',
      }],
    })
    const rule: Rule = { id: 'r2', kind: 'max_debt_to_income', label: 'DTI máx 35%', value: 0.35, priority: 'critical', enabled: true }
    const result = evaluateRules([rule], buildContext(snap))
    expect(result.violations.some((v) => v.ruleKind === 'max_debt_to_income')).toBe(true)
    expect(result.criticalCount).toBe(1)
  })

  it('passes emergency_fund_months rule when liquid assets are sufficient', () => {
    // base: liquidAssets = 14M, expenses = 1.1M → 12.7 months coverage
    const rule: Rule = { id: 'r3', kind: 'emergency_fund_months', label: 'Emergencia 3 meses', value: 3, priority: 'high', enabled: true }
    const result = evaluateRules([rule], buildContext())
    expect(result.violations).toHaveLength(0)
  })

  it('violates emergency_fund_months when liquid assets insufficient', () => {
    const snap = snapshotWith({
      accounts: [{ id: 'a1', name: 'Cuenta', kind: 'checking', balance: 100_000, isLiquid: true }],
    })
    const rule: Rule = { id: 'r3', kind: 'emergency_fund_months', label: 'Emergencia 3 meses', value: 3, priority: 'high', enabled: true }
    const result = evaluateRules([rule], buildContext(snap))
    expect(result.violations.some((v) => v.ruleKind === 'emergency_fund_months')).toBe(true)
  })

  it('skips disabled rules', () => {
    const rule: Rule = { id: 'r1', kind: 'min_savings_rate', label: 'Ahorro 20%', value: 0.99, priority: 'critical', enabled: false }
    const result = evaluateRules([rule], buildContext())
    expect(result.violations).toHaveLength(0)
    expect(result.compliant).toBe(true)
  })

  it('reduces score for each violation weighted by priority', () => {
    const rules: Rule[] = [
      { id: 'r1', kind: 'min_savings_rate', label: 'A', value: 0.99, priority: 'critical', enabled: true },
      { id: 'r2', kind: 'max_debt_to_income', label: 'B', value: 0.001, priority: 'high', enabled: true },
    ]
    const result = evaluateRules(rules, buildContext())
    expect(result.score).toBeLessThan(60) // Both should be violated
  })
})
