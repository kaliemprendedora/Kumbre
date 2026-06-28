import type { Metadata } from 'next'
import { Wallet, TrendingUp, TrendingDown, Building2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatCard } from '@/components/dashboard/StatCard'
import { CashflowChart } from '@/components/dashboard/CashflowChart'
import { ObjectiveCard } from '@/components/dashboard/ObjectiveCard'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import {
  mockAccounts,
  mockObjectives,
  mockTransactions,
  mockCategories,
  mockCashflow,
  mockNetWorth,
  mockUpcomingEvents,
} from '@/data/mock'
import { formatCurrency } from '@/lib/utils'

export const metadata: Metadata = { title: 'Inicio' }

export default function DashboardPage() {
  const totalBalance = mockAccounts
    .filter((a) => a.universeId === 'universe-personal')
    .reduce((sum, a) => sum + a.balance, 0)

  const cashflow = mockCashflow
  const thisMonth = cashflow.at(-1)
  const prevMonth = cashflow.at(-2)
  const incomeTrend =
    thisMonth && prevMonth && prevMonth.income > 0
      ? Math.round(((thisMonth.income - prevMonth.income) / prevMonth.income) * 100)
      : 0
  const expenseTrend =
    thisMonth && prevMonth && prevMonth.expenses > 0
      ? Math.round(((thisMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100)
      : 0

  const recentTransactions = [...mockTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Net worth banner */}
      <div className="rounded-[var(--radius-xl)] bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-[var(--shadow-lg)]">
        <p className="text-sm font-medium text-brand-200 mb-1">Patrimonio neto</p>
        <p className="text-4xl font-bold tracking-tight mb-3">
          {formatCurrency(mockNetWorth.netWorth, 'CLP')}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-green-300" />
          <span className="text-brand-200">
            +{mockNetWorth.trend}% este mes
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Saldo total"
          value={formatCurrency(totalBalance, 'CLP')}
          icon={<Wallet className="h-4 w-4" />}
          accent="brand"
        />
        <StatCard
          label="Ingresos del mes"
          value={formatCurrency(thisMonth?.income ?? 0, 'CLP')}
          trend={incomeTrend}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="success"
        />
        <StatCard
          label="Gastos del mes"
          value={formatCurrency(thisMonth?.expenses ?? 0, 'CLP')}
          trend={expenseTrend}
          icon={<TrendingDown className="h-4 w-4" />}
          accent="danger"
        />
        <StatCard
          label="Activos totales"
          value={formatCurrency(mockNetWorth.totalAssets, 'CLP')}
          icon={<Building2 className="h-4 w-4" />}
          accent="brand"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Cashflow chart — takes 2/3 */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flujo de caja</CardTitle>
            </CardHeader>
            <CardContent>
              <CashflowChart data={mockCashflow} />
            </CardContent>
          </Card>

          <RecentTransactions transactions={recentTransactions} categories={mockCategories} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <UpcomingEvents events={mockUpcomingEvents} />

          <div>
            <h2 className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">
              Objetivos activos
            </h2>
            <div className="space-y-3">
              {mockObjectives.slice(0, 3).map((obj) => (
                <ObjectiveCard key={obj.id} objective={obj} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
