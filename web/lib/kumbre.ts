import { KumbreEngine } from '@/engine/KumbreEngine'
import { personalSnapshot } from './snapshot'

// Server-side engine instance. In production this would be
// initialized from the user's actual data via repository.
export const engine = new KumbreEngine(personalSnapshot)

const CURRENT_PERIOD = {
  start: '2026-06-01T00:00:00Z',
  end: '2026-06-30T23:59:59Z',
}

export function getAnalysis() {
  const cashflow = engine.cashFlow(CURRENT_PERIOD)
  const netWorth = engine.netWorth()
  const { debt, goals, funds, capacity, rules } = engine.analyze()
  return { cashflow, netWorth, debt, goals, funds, capacity, rules }
}

export { personalSnapshot as snapshot }
