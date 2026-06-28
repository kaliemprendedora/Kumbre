import { createClient } from './server'
import type { FinancialSnapshot } from '@/engine/types/inputs'

export async function getUserSnapshot(): Promise<FinancialSnapshot | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [accounts, transactions, debts, objectives] = await Promise.all([
    supabase.from('accounts').select('*').eq('user_id', user.id),
    supabase.from('transactions').select('*').eq('user_id', user.id),
    supabase.from('debts').select('*').eq('user_id', user.id),
    supabase.from('objectives').select('*').eq('user_id', user.id),
  ])

  if (!accounts.data?.length) return null

  return {
    asOf: new Date().toISOString(),
    investments: [],
    accounts: accounts.data.map(a => ({
      id: a.id, name: a.name, kind: a.kind,
      balance: a.balance, isLiquid: a.is_liquid,
    })),
    transactions: transactions.data?.map(t => ({
      id: t.id, accountId: t.account_id, description: t.description,
      amount: t.amount, kind: t.kind, isRecurring: t.is_recurring,
      date: new Date(t.date).toISOString(), tags: t.tags ?? [],
    })) ?? [],
    debts: debts.data?.map(d => ({
      id: d.id, name: d.name, kind: d.kind,
      originalAmount: d.original_amount, remainingAmount: d.remaining_amount,
      monthlyPayment: d.monthly_payment, interestRate: d.interest_rate,
      startDate: new Date(d.start_date).toISOString(),
      endDate: new Date(d.end_date).toISOString(),
    })) ?? [],
    objectives: objectives.data?.map(o => ({
      id: o.id, name: o.name,
      targetAmount: o.target_amount, currentAmount: o.current_amount,
      targetDate: new Date(o.target_date).toISOString(),
      priority: 1, status: 'on_track' as const, linkedFundIds: [],
    })) ?? [],
    rules: [
      { id: 'r1', label: 'Tasa de ahorro mínima', kind: 'min_savings_rate' as const, value: 0.20, priority: 'high' as const, enabled: true },
      { id: 'r2', label: 'Deuda máxima sobre ingreso', kind: 'max_debt_to_income' as const, value: 0.35, priority: 'high' as const, enabled: true },
      { id: 'r3', label: 'Fondo de emergencia', kind: 'emergency_fund_months' as const, value: 3, priority: 'medium' as const, enabled: true },
    ],
    funds: [],
  }
}
