import { describe, it, expect } from 'vitest'
import {
  addMonths,
  monthsBetween,
  monthsBetweenISO,
  addMonthsISO,
  toISOMonth,
  clampMonths,
} from '../core/dateUtils'

describe('dateUtils', () => {
  describe('addMonths', () => {
    it('adds months correctly', () => {
      const d = new Date('2026-01-01')
      expect(addMonths(d, 3).getMonth()).toBe(3) // April (0-indexed)
    })
    it('handles year rollover', () => {
      const d = new Date('2026-11-01')
      const result = addMonths(d, 3)
      expect(result.getFullYear()).toBe(2027)
      expect(result.getMonth()).toBe(1) // February
    })
  })

  describe('monthsBetween', () => {
    it('returns 0 for same month', () => {
      expect(monthsBetween(new Date('2026-06-01'), new Date('2026-06-15'))).toBe(0)
    })
    it('calculates months correctly', () => {
      expect(monthsBetween(new Date('2026-01-01'), new Date('2026-07-01'))).toBe(6)
    })
    it('works across years', () => {
      expect(monthsBetween(new Date('2025-01-01'), new Date('2027-01-01'))).toBe(24)
    })
  })

  describe('monthsBetweenISO', () => {
    it('calculates correctly from ISO strings', () => {
      expect(monthsBetweenISO('2026-01-01T00:00:00Z', '2027-01-01T00:00:00Z')).toBe(12)
    })
  })

  describe('addMonthsISO', () => {
    it('returns ISO month string', () => {
      expect(addMonthsISO('2026-01-01T00:00:00Z', 6)).toBe('2026-07-01')
    })
    it('handles year rollover', () => {
      expect(addMonthsISO('2026-10-01T00:00:00Z', 6)).toBe('2027-04-01')
    })
  })

  describe('toISOMonth', () => {
    it('formats to YYYY-MM-01', () => {
      expect(toISOMonth(new Date('2026-06-15'))).toBe('2026-06-01')
    })
  })

  describe('clampMonths', () => {
    it('returns closest valid value', () => {
      expect(clampMonths(1)).toBe(1)
      expect(clampMonths(2)).toBe(1)
      expect(clampMonths(4)).toBe(3)
      expect(clampMonths(60)).toBe(60)
      expect(clampMonths(100)).toBe(60)
    })
  })
})
