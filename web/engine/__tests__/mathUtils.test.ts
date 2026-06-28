import { describe, it, expect } from 'vitest'
import {
  round,
  percent,
  weightedAverage,
  monthlyPayment,
  totalInterest,
  remainingBalance,
  compoundGrowth,
  requiredMonthlySaving,
  monthsToReachTarget,
  score,
} from '../core/mathUtils'

describe('mathUtils', () => {
  describe('round', () => {
    it('rounds to 2 decimals by default', () => {
      expect(round(1.236, 2)).toBe(1.24)
      expect(round(1.234, 2)).toBe(1.23)
    })
    it('rounds to 0 decimals', () => {
      expect(round(1234567.6, 0)).toBe(1234568)
    })
  })

  describe('percent', () => {
    it('calculates percentage', () => {
      expect(percent(25, 100)).toBe(25)
      expect(percent(1, 3)).toBe(33.33)
    })
    it('returns 0 when total is 0', () => {
      expect(percent(5, 0)).toBe(0)
    })
  })

  describe('weightedAverage', () => {
    it('calculates weighted average', () => {
      expect(weightedAverage([0.1, 0.2], [1000, 2000])).toBeCloseTo(0.1667, 3)
    })
    it('returns 0 when total weight is 0', () => {
      expect(weightedAverage([0.1, 0.2], [0, 0])).toBe(0)
    })
  })

  describe('monthlyPayment', () => {
    it('calculates payment for zero rate (simple division)', () => {
      expect(monthlyPayment(12000, 0, 12)).toBe(1000)
    })
    it('calculates payment with interest', () => {
      // $1,000 at 12% annual for 12 months ≈ $88.85
      expect(monthlyPayment(1000, 0.12, 12)).toBeCloseTo(88.85, 0)
    })
  })

  describe('totalInterest', () => {
    it('returns 0 for zero-rate loan', () => {
      expect(totalInterest(12000, 0, 12)).toBe(0)
    })
    it('calculates interest cost', () => {
      const interest = totalInterest(1_000_000, 0.12, 12)
      expect(interest).toBeGreaterThan(0)
      expect(interest).toBeLessThan(150_000)
    })
  })

  describe('remainingBalance', () => {
    it('returns 0 when fully paid', () => {
      expect(remainingBalance(1000, 0, 12, 12)).toBe(0)
    })
    it('returns original principal at start', () => {
      expect(remainingBalance(1000, 0, 12, 0)).toBeCloseTo(1000, 0)
    })
    it('decreases each month', () => {
      const b0 = remainingBalance(1000, 0.12, 12, 0)
      const b6 = remainingBalance(1000, 0.12, 12, 6)
      const b12 = remainingBalance(1000, 0.12, 12, 12)
      expect(b0).toBeGreaterThan(b6)
      expect(b6).toBeGreaterThan(b12)
      expect(b12).toBeCloseTo(0, 0)
    })
  })

  describe('compoundGrowth', () => {
    it('grows at correct rate', () => {
      // $1000 at 12% annual for 12 months ≈ $1127
      expect(compoundGrowth(1000, 0.12, 12)).toBeCloseTo(1126.83, 0)
    })
    it('returns principal for 0 months', () => {
      expect(compoundGrowth(1000, 0.12, 0)).toBe(1000)
    })
  })

  describe('requiredMonthlySaving', () => {
    it('returns 0 when already at target', () => {
      expect(requiredMonthlySaving(1000, 1000, 12)).toBe(0)
    })
    it('calculates correct monthly saving (no interest)', () => {
      expect(requiredMonthlySaving(12000, 0, 12)).toBe(1000)
    })
    it('returns remaining when months is 0', () => {
      expect(requiredMonthlySaving(5000, 2000, 0)).toBe(3000)
    })
  })

  describe('monthsToReachTarget', () => {
    it('returns 0 when already at target', () => {
      expect(monthsToReachTarget(1000, 1000, 100)).toBe(0)
    })
    it('calculates months correctly (no interest)', () => {
      expect(monthsToReachTarget(12000, 0, 1000)).toBe(12)
    })
    it('returns Infinity for 0 contribution', () => {
      expect(monthsToReachTarget(12000, 0, 0)).toBe(Infinity)
    })
  })

  describe('score', () => {
    it('clamps to 0-100', () => {
      expect(score(-50)).toBe(0)
      expect(score(150)).toBe(100)
      expect(score(75)).toBe(75)
    })
  })
})
