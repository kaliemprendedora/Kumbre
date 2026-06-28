import { KumbreEngine } from '@/engine/KumbreEngine'
import { personalSnapshot } from './snapshot'
import { getUserSnapshot } from './supabase/data'
import type { FinancialSnapshot } from '@/engine/types/inputs'

const CURRENT_PERIOD = {
  start: '2026-06-01T00:00:00Z',
  end: '2026-06-30T23:59:59Z',
}

function analyzeSnapshot(snap: FinancialSnapshot) {
  const engine = new KumbreEngine(snap)
  const cashflow = engine.cashFlow(CURRENT_PERIOD)
  const netWorth = engine.netWorth()
  const { debt, goals, funds, capacity, rules } = engine.analyze()
  return { cashflow, netWorth, debt, goals, funds, capacity, rules, snapshot: snap }
}

export async function getAnalysisForUser() {
  const userSnap = await getUserSnapshot()
  return analyzeSnapshot(userSnap ?? personalSnapshot)
}

// Legacy sync helper using demo data (kept for backward compat)
export function getAnalysis() {
  return analyzeSnapshot(personalSnapshot)
}

export { personalSnapshot as snapshot }
