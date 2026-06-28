import type { Rule } from '../types/inputs'
import type { CashFlowResult, DebtResult, NetWorthResult, RuleEvaluationResult, RuleViolation, RuleWarning } from '../types/outputs'
import { round, score } from '../core/mathUtils'

interface RuleContext {
  cashflow: CashFlowResult
  debt: DebtResult
  netWorth: NetWorthResult
}

type RuleCheck = (rule: Rule, ctx: RuleContext) => {
  currentValue: number
  threshold: number
  violated: boolean
  margin: number
}

const RULE_CHECKS: Record<string, RuleCheck> = {
  min_savings_rate: (rule, { cashflow }) => {
    const current = cashflow.savingsRate
    const threshold = rule.value
    return {
      currentValue: current,
      threshold,
      violated: current < threshold,
      margin: round((current - threshold) / threshold, 4),
    }
  },

  max_debt_to_income: (rule, { debt }) => {
    const current = debt.debtToIncomeRatio
    const threshold = rule.value
    return {
      currentValue: current,
      threshold,
      violated: current > threshold,
      margin: round((threshold - current) / threshold, 4),
    }
  },

  emergency_fund_months: (rule, { cashflow, netWorth }) => {
    const monthlyExpenses = cashflow.expenses
    const liquidAssets = netWorth.liquidAssets
    const current = monthlyExpenses > 0 ? round(liquidAssets / monthlyExpenses, 2) : 0
    const threshold = rule.value
    return {
      currentValue: current,
      threshold,
      violated: current < threshold,
      margin: round((current - threshold) / threshold, 4),
    }
  },

  max_single_expense_ratio: (rule, { cashflow }) => {
    const largest = cashflow.byCategory[0]
    if (!largest) return { currentValue: 0, threshold: rule.value, violated: false, margin: 1 }
    const current = largest.percentage / 100
    const threshold = rule.value
    return {
      currentValue: current,
      threshold,
      violated: current > threshold,
      margin: round((threshold - current) / threshold, 4),
    }
  },

  // Placeholder checks for goal/fund protection rules (require external data to fully evaluate)
  goal_protected: (_rule, _ctx) => ({
    currentValue: 1,
    threshold: 1,
    violated: false,
    margin: 0,
  }),

  fund_protected: (_rule, _ctx) => ({
    currentValue: 1,
    threshold: 1,
    violated: false,
    margin: 0,
  }),

  max_card_utilization: (rule, { debt }) => {
    const cardDebt = debt.debts.filter((d) => d.name.toLowerCase().includes('tarjeta'))
    const total = cardDebt.reduce((s, d) => s + d.remainingAmount, 0)
    const threshold = rule.value
    // Without knowing card limits, we flag if card debt exists above threshold
    return {
      currentValue: total,
      threshold,
      violated: total > threshold,
      margin: threshold > 0 ? round((threshold - total) / threshold, 4) : 0,
    }
  },
}

// Warning zone: within 20% of threshold
const WARNING_MARGIN = 0.2

/**
 * RuleEngine — evaluates configurable financial rules against current state.
 * Returns structured violations and warnings, never text.
 */
export function evaluateRules(
  rules: Rule[],
  context: RuleContext
): RuleEvaluationResult {
  const enabledRules = rules.filter((r) => r.enabled)

  if (enabledRules.length === 0) {
    return {
      compliant: true,
      score: 100,
      violations: [],
      warnings: [],
      criticalCount: 0,
      highCount: 0,
    }
  }

  const violations: RuleViolation[] = []
  const warnings: RuleWarning[] = []

  for (const rule of enabledRules) {
    const checker = RULE_CHECKS[rule.kind]
    if (!checker) continue

    const { currentValue, threshold, violated, margin } = checker(rule, context)

    if (violated) {
      violations.push({
        ruleId: rule.id,
        ruleKind: rule.kind,
        label: rule.label,
        priority: rule.priority,
        currentValue: round(currentValue, 4),
        threshold,
        severity: round(Math.abs(margin), 4),
      })
    } else if (Math.abs(margin) < WARNING_MARGIN) {
      warnings.push({
        ruleId: rule.id,
        ruleKind: rule.kind,
        label: rule.label,
        currentValue: round(currentValue, 4),
        threshold,
        marginPercent: round(Math.abs(margin) * 100, 2),
      })
    }
  }

  const criticalCount = violations.filter((v) => v.priority === 'critical').length
  const highCount = violations.filter((v) => v.priority === 'high').length

  // Score: start at 100, deduct per violation weighted by priority
  const priorityWeights = { critical: 30, high: 20, medium: 10, low: 5 }
  const deduction = violations.reduce((s, v) => s + (priorityWeights[v.priority] ?? 5), 0)
  const warningDeduction = warnings.length * 2

  return {
    compliant: violations.length === 0,
    score: score(100 - deduction - warningDeduction),
    violations,
    warnings,
    criticalCount,
    highCount,
  }
}
