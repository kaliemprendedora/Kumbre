import type { Rule } from '../types/inputs'
import type { CashFlowResult, DebtResult, NetWorthResult, CapacityResult } from '../types/outputs'
import { round, score } from '../core/mathUtils'

// Standard maximum debt-to-income ratio for healthy finances
const MAX_SAFE_DTI = 0.35
// Minimum recommended emergency fund months
const MIN_EMERGENCY_MONTHS = 3

/**
 * CapacityEngine — calculates what the user CAN do financially.
 * This is the "ceiling" engine: it tells you your room to maneuver.
 */
export function calculateCapacity(
  cashflow: CashFlowResult,
  debt: DebtResult,
  netWorth: NetWorthResult,
  rules?: Rule[]
): CapacityResult {
  const { income, expenses, recurringExpenses, net } = cashflow

  // Approximate variable vs fixed expense split
  const fixedExpenses = round(recurringExpenses, 0)
  const variableExpenses = round(expenses - fixedExpenses, 0)
  const debtPayments = round(debt.totalMonthlyPayment, 0)

  // Monthly available after all obligations
  const monthlyAvailable = round(net, 0)

  // Savings capacity: how much can be saved monthly (after debt)
  const savingsCapacity = round(Math.max(0, monthlyAvailable), 0)

  // Investment capacity: savings minus minimum emergency fund contribution
  // We use 10% of income as emergency top-up until 3 months is covered
  const emergencyFundTarget = expenses * MIN_EMERGENCY_MONTHS
  const emergencyFundCurrent = netWorth.liquidAssets
  const emergencyFundGap = Math.max(0, emergencyFundTarget - emergencyFundCurrent)
  const emergencyTopUp = emergencyFundGap > 0 ? Math.min(round(income * 0.1, 0), savingsCapacity) : 0
  const investmentCapacity = round(Math.max(0, savingsCapacity - emergencyTopUp), 0)

  // Additional debt capacity: how much more monthly debt payment can be added safely
  // Keeps total DTI under MAX_SAFE_DTI
  const maxMonthlyDebt = round(income * MAX_SAFE_DTI, 0)
  const additionalDebtCapacity = round(Math.max(0, maxMonthlyDebt - debtPayments), 0)

  // Emergency fund months
  const emergencyFundMonths =
    expenses > 0 ? round(emergencyFundCurrent / expenses, 1) : 0

  // Financial health score (0-100)
  // Factors: savings rate, DTI, emergency fund coverage, net worth positive
  const savingsRateScore = score(cashflow.savingsRate * 200) // 50% rate = 100 score
  const dtiScore = score((1 - debt.debtToIncomeRatio / MAX_SAFE_DTI) * 100)
  const emergencyScore = score((emergencyFundMonths / MIN_EMERGENCY_MONTHS) * 100)
  const netWorthScore = score(netWorth.netWorth > 0 ? 100 : 0)

  const financialHealthScore = score(
    savingsRateScore * 0.35 +
    dtiScore * 0.25 +
    emergencyScore * 0.25 +
    netWorthScore * 0.15
  )

  return {
    monthlyAvailable,
    savingsCapacity,
    investmentCapacity,
    additionalDebtCapacity,
    emergencyFundMonths,
    financialHealthScore,
    breakdown: {
      income,
      fixedExpenses,
      variableExpenses,
      debtPayments,
      savings: savingsCapacity,
      available: monthlyAvailable,
    },
  }
}
