// Shared test fixtures — reusable across all engine tests.

import type { FinancialSnapshot } from '../types/inputs'

export const NOW = '2026-06-01T00:00:00Z'

export const baseSnapshot: FinancialSnapshot = {
  asOf: NOW,
  accounts: [
    { id: 'acc-1', name: 'Cuenta Corriente', kind: 'checking', balance: 4_000_000, isLiquid: true },
    { id: 'acc-2', name: 'Ahorro', kind: 'savings', balance: 10_000_000, isLiquid: true },
    { id: 'acc-3', name: 'Inversiones', kind: 'investment', balance: 15_000_000, isLiquid: false },
  ],
  transactions: [
    {
      id: 'tx-income-1',
      accountId: 'acc-1',
      amount: 3_500_000,
      kind: 'income',
      date: '2026-06-01T00:00:00Z',
      isRecurring: true,
      frequency: 'monthly',
      description: 'Sueldo',
      tags: [],
    },
    {
      id: 'tx-exp-arriendo',
      accountId: 'acc-1',
      amount: 850_000,
      kind: 'expense',
      date: '2026-06-05T00:00:00Z',
      categoryId: 'cat-arriendo',
      categoryName: 'Arriendo',
      isRecurring: true,
      frequency: 'monthly',
      description: 'Arriendo',
      tags: [],
    },
    {
      id: 'tx-exp-super',
      accountId: 'acc-1',
      amount: 200_000,
      kind: 'expense',
      date: '2026-06-10T00:00:00Z',
      categoryId: 'cat-alimentacion',
      categoryName: 'Alimentación',
      isRecurring: false,
      description: 'Supermercado',
      tags: [],
    },
    {
      id: 'tx-exp-transporte',
      accountId: 'acc-1',
      amount: 50_000,
      kind: 'expense',
      date: '2026-06-15T00:00:00Z',
      categoryId: 'cat-transporte',
      categoryName: 'Transporte',
      isRecurring: true,
      frequency: 'monthly',
      description: 'Bip mensual',
      tags: [],
    },
  ],
  debts: [
    {
      id: 'debt-1',
      name: 'Crédito Personal',
      kind: 'personal',
      originalAmount: 5_000_000,
      remainingAmount: 3_200_000,
      monthlyPayment: 180_000,
      interestRate: 0.12,
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2027-06-01T00:00:00Z',
    },
  ],
  investments: [
    {
      id: 'inv-1',
      name: 'Fondo Mutuo',
      kind: 'fund',
      currentValue: 8_000_000,
      avgCost: 6_500_000,
      quantity: 1,
      expectedAnnualReturn: 0.07,
    },
  ],
  objectives: [
    {
      id: 'obj-casa',
      name: 'Casa propia',
      targetAmount: 100_000_000,
      currentAmount: 67_400_000,
      targetDate: '2029-01-01T00:00:00Z',
      priority: 1,
      status: 'on_track',
      linkedFundIds: ['fund-1'],
    },
    {
      id: 'obj-europa',
      name: 'Europa',
      targetAmount: 5_000_000,
      currentAmount: 1_900_000,
      targetDate: '2027-08-01T00:00:00Z',
      priority: 2,
      status: 'at_risk',
      linkedFundIds: ['fund-2'],
    },
  ],
  funds: [
    {
      id: 'fund-1',
      name: 'Fondo Casa',
      currentAmount: 67_400_000,
      targetAmount: 100_000_000,
      objectiveIds: ['obj-casa'],
      allocationRule: { trigger: 'on_income', percentage: 0.20 },
    },
    {
      id: 'fund-2',
      name: 'Fondo Europa',
      currentAmount: 1_900_000,
      targetAmount: 5_000_000,
      objectiveIds: ['obj-europa'],
      allocationRule: { trigger: 'on_income', percentage: 0.05 },
    },
  ],
  rules: [
    {
      id: 'rule-savings',
      kind: 'min_savings_rate',
      label: 'Ahorro mínimo 20%',
      value: 0.20,
      priority: 'high',
      enabled: true,
    },
    {
      id: 'rule-dti',
      kind: 'max_debt_to_income',
      label: 'Deuda máxima 35% ingreso',
      value: 0.35,
      priority: 'critical',
      enabled: true,
    },
    {
      id: 'rule-emergency',
      kind: 'emergency_fund_months',
      label: 'Fondo emergencia 3 meses',
      value: 3,
      priority: 'high',
      enabled: true,
    },
  ],
}

export function snapshotWith(overrides: Partial<FinancialSnapshot>): FinancialSnapshot {
  return { ...baseSnapshot, ...overrides }
}
