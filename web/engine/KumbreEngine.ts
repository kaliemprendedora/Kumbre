// KumbreEngine — the single entry point facade.
// Composes all sub-engines into a coherent API.
// Zero React/Next.js dependencies.

import type { FinancialSnapshot, Decision, Assumptions } from './types/inputs'
import type {
  CashFlowResult,
  NetWorthResult,
  DebtResult,
  GoalResult,
  FundResult,
  CapacityResult,
  RuleEvaluationResult,
  ProjectionResult,
  ScenarioResult,
  SimulationResult,
} from './types/outputs'

import { calculateCashFlow } from './engines/CashFlowEngine'
import { calculateNetWorth } from './engines/NetWorthEngine'
import { calculateDebt } from './engines/DebtEngine'
import { calculateGoals } from './engines/GoalEngine'
import { calculateFunds } from './engines/FundEngine'
import { calculateCapacity } from './engines/CapacityEngine'
import { evaluateRules } from './engines/RuleEngine'
import { project } from './engines/ProjectionEngine'
import { compareScenarios } from './engines/ScenarioEngine'
import { simulate } from './engines/SimulationEngine'
import { addMonthsISO } from './core/dateUtils'

// ─── Full analysis result ────────────────────────────────────────────────────

export interface FullAnalysis {
  cashflow: CashFlowResult
  netWorth: NetWorthResult
  debt: DebtResult
  goals: GoalResult
  funds: FundResult
  capacity: CapacityResult
  rules: RuleEvaluationResult
}

// ─── KumbreEngine facade ─────────────────────────────────────────────────────

export class KumbreEngine {
  private snapshot: FinancialSnapshot

  constructor(snapshot: FinancialSnapshot) {
    this.snapshot = snapshot
  }

  /**
   * Full analysis of the current financial state.
   * Runs all engines and returns a unified result object.
   */
  analyze(lookbackMonths = 1): FullAnalysis {
    const { asOf } = this.snapshot
    const periodStart = addMonthsISO(asOf, -lookbackMonths)
    const periodEnd = asOf

    const cashflow = calculateCashFlow(this.snapshot, { start: periodStart, end: periodEnd })
    const netWorth = calculateNetWorth(this.snapshot)
    const debt = calculateDebt(this.snapshot, cashflow.income)
    const goals = calculateGoals(this.snapshot, cashflow.net)
    const funds = calculateFunds(this.snapshot, cashflow.income, cashflow.net)
    const capacity = calculateCapacity(cashflow, debt, netWorth, this.snapshot.rules)
    const rules = evaluateRules(this.snapshot.rules, { cashflow, debt, netWorth })

    return { cashflow, netWorth, debt, goals, funds, capacity, rules }
  }

  /**
   * Simulate the impact of a financial decision.
   */
  simulate(decision: Decision): SimulationResult {
    return simulate(this.snapshot, decision)
  }

  /**
   * Project financial state forward N months.
   */
  project(months: number, assumptions?: Assumptions): ProjectionResult {
    return project(this.snapshot, months, assumptions)
  }

  /**
   * Compare multiple scenarios (optimistic, conservative, crisis + custom).
   */
  compareScenarios(months: number, scenarios?: Parameters<typeof compareScenarios>[2]): ScenarioResult {
    return compareScenarios(this.snapshot, months, scenarios)
  }

  /**
   * Evaluate configured financial rules against current state.
   */
  evaluateRules(): RuleEvaluationResult {
    const analysis = this.analyze()
    return evaluateRules(this.snapshot.rules, {
      cashflow: analysis.cashflow,
      debt: analysis.debt,
      netWorth: analysis.netWorth,
    })
  }

  /**
   * Returns cashflow for a specific period.
   */
  cashFlow(period: { start: string; end: string }): CashFlowResult {
    return calculateCashFlow(this.snapshot, period)
  }

  /**
   * Returns net worth breakdown.
   */
  netWorth(): NetWorthResult {
    return calculateNetWorth(this.snapshot)
  }

  /**
   * Returns a new engine with an updated snapshot.
   * Useful for what-if chains without mutating state.
   */
  withSnapshot(snapshot: FinancialSnapshot): KumbreEngine {
    return new KumbreEngine(snapshot)
  }
}

// ─── Standalone function exports (for tree-shakeable usage) ─────────────────

export {
  calculateCashFlow,
  calculateNetWorth,
  calculateDebt,
  calculateGoals,
  calculateFunds,
  calculateCapacity,
  evaluateRules,
  project,
  compareScenarios,
  simulate,
}
