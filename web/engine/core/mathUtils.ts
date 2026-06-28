// Financial math primitives used across all engines.

export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

export function percent(value: number, total: number): number {
  if (total === 0) return 0
  return round((value / total) * 100, 2)
}

export function weightedAverage(values: number[], weights: number[]): number {
  const totalWeight = weights.reduce((s, w) => s + w, 0)
  if (totalWeight === 0) return 0
  const weighted = values.reduce((s, v, i) => s + v * (weights[i] ?? 0), 0)
  return round(weighted / totalWeight, 4)
}

// Monthly payment for a loan (amortization formula)
export function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return round(principal / months, 2)
  const r = annualRate / 12
  return round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1), 2)
}

// Total interest paid over loan life
export function totalInterest(
  principal: number,
  annualRate: number,
  months: number
): number {
  const payment = monthlyPayment(principal, annualRate, months)
  return round(payment * months - principal, 2)
}

// Remaining balance after n payments
export function remainingBalance(
  principal: number,
  annualRate: number,
  totalMonths: number,
  monthsPaid: number
): number {
  if (annualRate === 0) {
    return round(principal - (principal / totalMonths) * monthsPaid, 2)
  }
  const r = annualRate / 12
  return round(
    principal * (Math.pow(1 + r, totalMonths) - Math.pow(1 + r, monthsPaid)) /
      (Math.pow(1 + r, totalMonths) - 1),
    2
  )
}

// Compound growth
export function compoundGrowth(principal: number, annualRate: number, months: number): number {
  return round(principal * Math.pow(1 + annualRate / 12, months), 2)
}

// Savings needed per month to reach target
export function requiredMonthlySaving(
  target: number,
  current: number,
  months: number,
  annualRate = 0
): number {
  const remaining = target - current
  if (remaining <= 0) return 0
  if (months <= 0) return remaining
  if (annualRate === 0) return round(remaining / months, 2)
  const r = annualRate / 12
  return round((remaining * r) / (Math.pow(1 + r, months) - 1), 2)
}

// Months needed to save target amount
export function monthsToReachTarget(
  target: number,
  current: number,
  monthlyContribution: number,
  annualRate = 0
): number {
  if (current >= target) return 0
  if (monthlyContribution <= 0) return Infinity
  if (annualRate === 0) {
    return Math.ceil((target - current) / monthlyContribution)
  }
  const r = annualRate / 12
  const remaining = target - current
  return Math.ceil(Math.log(1 + (remaining * r) / monthlyContribution) / Math.log(1 + r))
}

// Clamp to 0-100 range for scores
export function score(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)))
}
