import { describe, it, expect } from 'vitest'
import { simulate } from '../engines/SimulationEngine'
import { baseSnapshot } from './fixtures'
import type { Decision } from '../types/inputs'

const NOW = baseSnapshot.asOf

describe('SimulationEngine', () => {
  it('returns structured result for a cash purchase', () => {
    const decision: Decision = {
      type: 'purchase',
      description: 'Laptop nueva',
      amount: 1_000_000,
      startDate: NOW,
    }
    const result = simulate(baseSnapshot, decision)
    expect(result.decision.type).toBe('purchase')
    expect(result.totalCost).toBe(1_000_000)
    expect(result.monthlyCost).toBe(0)
    expect(result.feasible).toBe(true)
  })

  it('marks infeasible when decision drains income > 20%', () => {
    const decision: Decision = {
      type: 'recurring_expense',
      description: 'Suscripción cara',
      amount: 3_500_000,
      monthlyAmount: 3_500_000,
      durationMonths: 12,
      startDate: NOW,
    }
    const result = simulate(baseSnapshot, decision)
    expect(result.feasible).toBe(false)
    expect(result.feasibilityReason).toBeTruthy()
  })

  it('calculates monthly cost for installment purchase', () => {
    const decision: Decision = {
      type: 'purchase',
      description: 'Televisor',
      amount: 600_000,
      installments: 6,
      interestRate: 0,
      startDate: NOW,
    }
    const result = simulate(baseSnapshot, decision)
    expect(result.monthlyCost).toBeCloseTo(100_000, 0)
  })

  it('impactOnCashFlow has negative monthlyDelta for expenses', () => {
    const decision: Decision = {
      type: 'recurring_expense',
      description: 'Gym',
      amount: 50_000,
      monthlyAmount: 50_000,
      durationMonths: 12,
      startDate: NOW,
    }
    const result = simulate(baseSnapshot, decision)
    expect(result.impactOnCashFlow.monthlyDelta).toBeLessThan(0)
  })

  it('income_change decision increases cashflow', () => {
    const decision: Decision = {
      type: 'income_change',
      description: 'Aumento sueldo',
      amount: 500_000,
      durationMonths: 12,
      startDate: NOW,
    }
    const result = simulate(baseSnapshot, decision)
    expect(result.impactOnCashFlow.monthlyDelta).toBeGreaterThan(0)
  })

  it('credit decision creates debt impact', () => {
    const decision: Decision = {
      type: 'credit',
      description: 'Crédito consumo',
      amount: 3_000_000,
      interestRate: 0.15,
      durationMonths: 24,
      startDate: NOW,
    }
    const result = simulate(baseSnapshot, decision)
    expect(result.impactOnDebt).not.toBeNull()
    expect(result.impactOnDebt!.newDebtTotal).toBeGreaterThan(0)
  })

  it('provides baseline and decision timelines', () => {
    const decision: Decision = {
      type: 'purchase',
      description: 'Muebles',
      amount: 500_000,
      startDate: NOW,
    }
    const result = simulate(baseSnapshot, decision)
    expect(result.baselineTimeline).toHaveLength(12)
    expect(result.decisionTimeline).toHaveLength(12)
  })

  it('returns riskLevel as valid value', () => {
    const decision: Decision = {
      type: 'purchase',
      description: 'Café',
      amount: 10_000,
      startDate: NOW,
    }
    const result = simulate(baseSnapshot, decision)
    expect(['none', 'low', 'medium', 'high', 'critical']).toContain(result.riskLevel)
  })

  it('provides alternatives for cash purchase', () => {
    const decision: Decision = {
      type: 'purchase',
      description: 'Moto',
      amount: 2_000_000,
      startDate: NOW,
    }
    const result = simulate(baseSnapshot, decision)
    expect(result.alternatives.length).toBeGreaterThan(0)
  })

  it('impactOnNetWorth.immediateImpact is negative for cash purchase', () => {
    const decision: Decision = {
      type: 'purchase',
      description: 'Tablet',
      amount: 800_000,
      startDate: NOW,
    }
    const result = simulate(baseSnapshot, decision)
    expect(result.impactOnNetWorth.immediateImpact).toBeLessThanOrEqual(0)
  })
})
