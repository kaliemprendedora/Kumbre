import { KumbreEngine } from '@/engine/KumbreEngine'
import { personalSnapshot } from './snapshot'
import { getUserSnapshot } from './supabase/data'
import type { FinancialSnapshot } from '@/engine/types/inputs'

function analyzeSnapshot(snap: FinancialSnapshot) {
  const now = new Date()
  const currentPeriod = {
    start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
  }
  const engine = new KumbreEngine(snap)
  const cashflow = engine.cashFlow(currentPeriod)
  const netWorth = engine.netWorth()
  const { debt, goals, funds, capacity, rules } = engine.analyze()
  return { cashflow, netWorth, debt, goals, funds, capacity, rules, snapshot: snap }
}

export async function getAnalysisForUser() {
  const userSnap = await getUserSnapshot()
  return analyzeSnapshot(userSnap ?? personalSnapshot)
}

export function getAnalysis() {
  return analyzeSnapshot(personalSnapshot)
}

export { personalSnapshot as snapshot }
