import type { FinancialSnapshot, EngineDebt } from '../types/inputs'
import type { DebtResult, DebtDetail, RiskLevel } from '../types/outputs'
import { round, weightedAverage, totalInterest } from '../core/mathUtils'
import { monthsBetweenISO, addMonthsISO } from '../core/dateUtils'

function debtRiskLevel(debtToIncomeRatio: number): RiskLevel {
  if (debtToIncomeRatio === 0) return 'none'
  if (debtToIncomeRatio < 0.2) return 'low'
  if (debtToIncomeRatio < 0.35) return 'medium'
  if (debtToIncomeRatio < 0.5) return 'high'
  return 'critical'
}

function buildDebtDetail(debt: EngineDebt, asOf: string): DebtDetail {
  const remainingMonths = Math.max(0, monthsBetweenISO(asOf, debt.endDate))
  const interestRemaining = totalInterest(debt.remainingAmount, debt.interestRate, remainingMonths)

  return {
    id: debt.id,
    name: debt.name,
    remainingAmount: round(debt.remainingAmount, 0),
    monthlyPayment: round(debt.monthlyPayment, 0),
    interestRate: debt.interestRate,
    remainingMonths,
    totalInterestRemaining: round(interestRemaining, 0),
    payoffDate: debt.endDate,
  }
}

/**
 * DebtEngine — calculates debt metrics, risk level, and payoff timeline.
 */
export function calculateDebt(snapshot: FinancialSnapshot, monthlyIncome: number): DebtResult {
  const { debts, asOf } = snapshot

  if (debts.length === 0) {
    return {
      totalDebt: 0,
      totalMonthlyPayment: 0,
      debtToIncomeRatio: 0,
      weightedInterestRate: 0,
      estimatedDebtFreeDate: asOf,
      riskLevel: 'none',
      debts: [],
      highestInterestDebt: null,
      largestDebt: null,
    }
  }

  const details = debts.map((d) => buildDebtDetail(d, asOf))
  const totalDebt = round(details.reduce((s, d) => s + d.remainingAmount, 0), 0)
  const totalMonthlyPayment = round(details.reduce((s, d) => s + d.monthlyPayment, 0), 0)
  const debtToIncomeRatio = monthlyIncome > 0 ? round(totalMonthlyPayment / monthlyIncome, 4) : 0

  const weightedInterestRate = weightedAverage(
    debts.map((d) => d.interestRate),
    debts.map((d) => d.remainingAmount)
  )

  // Estimated debt-free date: furthest payoff date among all debts
  const latestPayoff = details.reduce(
    (latest, d) =>
      new Date(d.payoffDate) > new Date(latest) ? d.payoffDate : latest,
    asOf
  )

  const highestInterest = [...debts].sort((a, b) => b.interestRate - a.interestRate)[0]
  const largest = [...debts].sort((a, b) => b.remainingAmount - a.remainingAmount)[0]

  return {
    totalDebt,
    totalMonthlyPayment,
    debtToIncomeRatio,
    weightedInterestRate,
    estimatedDebtFreeDate: latestPayoff,
    riskLevel: debtRiskLevel(debtToIncomeRatio),
    debts: details,
    highestInterestDebt: highestInterest?.name ?? null,
    largestDebt: largest?.name ?? null,
  }
}
