// Adapter: converts domain types (@/types) → engine types.
// The engine never imports from @/types. This adapter is the only bridge.

import type {
  Account,
  Transaction,
  Objective,
  Fund,
} from '@/types'
import type {
  EngineAccount,
  EngineTransaction,
  EngineObjective,
  EngineFund,
  FinancialSnapshot,
  Rule,
} from '../types/inputs'

export function accountToEngine(account: Account): EngineAccount {
  return {
    id: account.id,
    name: account.name,
    kind: account.type,
    balance: account.balance,
    isLiquid: account.type === 'checking' || account.type === 'savings' || account.type === 'cash',
  }
}

export function transactionToEngine(tx: Transaction): EngineTransaction {
  return {
    id: tx.id,
    accountId: tx.accountId,
    amount: tx.amount,
    kind: tx.type,
    date: tx.date,
    categoryId: tx.categoryId,
    isRecurring: tx.isRecurring,
    frequency: tx.recurrenceRule?.frequency as any,
    description: tx.description,
    tags: tx.tags,
  }
}

export function objectiveToEngine(obj: Objective): EngineObjective {
  return {
    id: obj.id,
    name: obj.name,
    targetAmount: obj.targetAmount ?? 0,
    currentAmount: obj.currentAmount,
    targetDate: obj.targetDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    priority: obj.priority,
    status: obj.status as any,
    linkedFundIds: obj.fundIds,
  }
}

export function fundToEngine(fund: Fund): EngineFund {
  return {
    id: fund.id,
    name: fund.name,
    currentAmount: fund.currentAmount,
    targetAmount: fund.targetAmount,
    objectiveIds: fund.objectiveIds,
    allocationRule: fund.rules[0]
      ? {
          trigger: fund.rules[0].trigger,
          percentage: fund.rules[0].percentage ? fund.rules[0].percentage / 100 : undefined,
          fixedAmount: fund.rules[0].fixedAmount,
        }
      : { trigger: 'fixed_monthly', fixedAmount: 0 },
  }
}

export function buildSnapshot(params: {
  accounts: Account[]
  transactions: Transaction[]
  objectives: Objective[]
  funds: Fund[]
  rules?: Rule[]
  asOf?: string
}): FinancialSnapshot {
  return {
    asOf: params.asOf ?? new Date().toISOString(),
    accounts: params.accounts.map(accountToEngine),
    transactions: params.transactions.map(transactionToEngine),
    debts: [],
    investments: [],
    objectives: params.objectives.map(objectiveToEngine),
    funds: params.funds.map(fundToEngine),
    rules: params.rules ?? [],
  }
}
