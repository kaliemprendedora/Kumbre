import { KumbreEngine } from '@/engine/KumbreEngine'
import { personalSnapshot } from './snapshot'
import { getUserSnapshot } from './supabase/data'
import type { FinancialSnapshot } from '@/engine/types/inputs'

const now = new Date()
const CURRENT_PERIOD = {
  start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
  end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
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