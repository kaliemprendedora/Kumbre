import type { FinancialSnapshot } from '../types/inputs'
import type { NetWorthResult } from '../types/outputs'
import { round, percent } from '../core/mathUtils'

/**
 * NetWorthEngine — calculates total assets, liabilities, net worth, and breakdown.
 */
export function calculateNetWorth(snapshot: FinancialSnapshot): NetWorthResult {
  const { accounts, debts, investments } = snapshot

  // Assets from accounts
  const cash = round(
    accounts
      .filter((a) => a.kind === 'cash' || a.kind === 'checking')
      .reduce((s, a) => s + a.balance, 0),
    0
  )
  const savings = round(
    accounts.filter((a) => a.kind === 'savings').reduce((s, a) => s + a.balance, 0),
    0
  )
  const investmentAccountValue = round(
    accounts.filter((a) => a.kind === 'investment' || a.kind === 'crypto').reduce((s, a) => s + a.balance, 0),
    0
  )
  const investmentPortfolioValue = round(
    investments.reduce((s, inv) => s + inv.currentValue, 0),
    0
  )

  const totalInvestments = round(investmentAccountValue + investmentPortfolioValue, 0)
  const totalAssets = round(cash + savings + totalInvestments, 0)
  const liquidAssets = round(cash + savings, 0)
  const illiquidAssets = round(totalInvestments, 0)

  // Liabilities
  const mortgages = round(
    debts.filter((d) => d.kind === 'mortgage').reduce((s, d) => s + d.remainingAmount, 0),
    0
  )
  const personalLoans = round(
    debts.filter((d) => d.kind === 'personal').reduce((s, d) => s + d.remainingAmount, 0),
    0
  )
  const vehicleLoans = round(
    debts.filter((d) => d.kind === 'vehicle').reduce((s, d) => s + d.remainingAmount, 0),
    0
  )
  const creditCards = round(
    debts.filter((d) => d.kind === 'credit_card').reduce((s, d) => s + d.remainingAmount, 0),
    0
  )
  const otherDebts = round(
    debts.filter((d) => d.kind === 'other').reduce((s, d) => s + d.remainingAmount, 0),
    0
  )
  const totalLiabilities = round(mortgages + personalLoans + vehicleLoans + creditCards + otherDebts, 0)

  const netWorth = round(totalAssets - totalLiabilities, 0)
  const debtToAssetRatio = totalAssets > 0 ? round(totalLiabilities / totalAssets, 4) : 0

  return {
    totalAssets,
    liquidAssets,
    illiquidAssets,
    totalLiabilities,
    netWorth,
    debtToAssetRatio,
    assetBreakdown: {
      cash,
      savings,
      investments: totalInvestments,
      realEstate: 0,
      other: 0,
    },
    liabilityBreakdown: {
      mortgages,
      personalLoans,
      vehicleLoans,
      creditCards,
      other: otherDebts,
    },
  }
}
