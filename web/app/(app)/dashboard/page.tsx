import type { Metadata } from 'next'
import Link from 'next/link'
import { Wallet, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, Info } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/dashboard/StatCard'
import { CashflowChart } from '@/components/dashboard/CashflowChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import { GoalCard } from '@/components/dashboard/GoalCard'
import { HealthScoreRing } from '@/components/dashboard/HealthScoreRing'
import { mockCategories, mockTransactions } from '@/data/mock'
import { getAnalysisForUser } from '@/lib/kumbre'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatPercent } from '@/lib/utils'

export const metadata: Metadata = { title: 'Inicio' }

function weekLabel(start: Date, end: Date) {
  const fmt = (d: Date) => d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
  return `${fmt(start)} – ${fmt(end)}`
}

export default async function DashboardPage() {
  const { cashflow, netWorth, debt, goals, capacity, rules, snapshot } = await getAnalysisForUser()
  const isDemo = snapshot.accounts.every(a => a.id.startsWith('acc-'))

  // Category breakdown + weekly projection from real Supabase data
  type CatRow = { name: string; amount: number; percentage: number }
  type WeekRow = { label: string; amount: number }
  let categoryBreakdown: CatRow[] = []
  let incomeTotal = cashflow.income
  let weeklyProjection: WeekRow[] = []

  if (isDemo) {
    // Use engine breakdown for demo
    categoryBreakdown = cashflow.byCategory.slice(0, 6).map(c => ({
      name: c.categoryName, amount: c.amount, percentage: c.percentage,
    }))
    // Mock weekly projection
    weeklyProjection = [
      { label: 'Sem 1', amount: 580_000 },
      { label: 'Sem 2', amount: 320_000 },
      { label: 'Sem 3', amount: 900_000 },
      { label: 'Sem 4', amount: 420_000 },
    ]
  } else {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const [txsRes, catsRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', user.id),
        supabase.from('categories').select('id, name').eq('user_id', user.id),
      ])
      const txs = txsRes.data ?? []
      const catMap = new Map((catsRes.data ?? []).map(c => [c.id, c.name as string]))

      const now = new Date()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

      const monthTxs = txs.filter(t => {
        const d = new Date(t.date)
        return d >= monthStart && d <= monthEnd
      })
      const monthExpenses = monthTxs.filter(t => t.kind === 'expense')
      const totalExp = monthExpenses.reduce((s, t) => s + t.amount, 0)
      incomeTotal = monthTxs.filter(t => t.kind === 'income').reduce((s, t) => s + t.amount, 0)

      const catAmounts = new Map<string, { name: string; amount: number }>()
      for (const t of monthExpenses) {
        const key = t.category_id ?? '__none__'
        const name = t.category_id ? (catMap.get(t.category_id) ?? 'Sin categoría') : 'Sin categoría'
        const prev = catAmounts.get(key) ?? { name, amount: 0 }
        catAmounts.set(key, { name, amount: prev.amount + t.amount })
      }
      categoryBreakdown = Array.from(catAmounts.values())
        .map(({ name, amount }) => ({
          name, amount,
          percentage: totalExp > 0 ? Math.round(amount / totalExp * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 6)

      // Weekly projection: next 4 weeks of recurring expenses
      const recurringExp = txs.filter(t => t.is_recurring && t.kind === 'expense')
      for (let w = 0; w < 4; w++) {
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() + w * 7)
        weekStart.setHours(0, 0, 0, 0)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        weekEnd.setHours(23, 59, 59, 999)

        let weekAmount = 0
        for (const t of recurringExp) {
          const txDay = new Date(t.date).getDate()
          // Check in start month
          const c1 = new Date(weekStart.getFullYear(), weekStart.getMonth(), txDay)
          if (c1 >= weekStart && c1 <= weekEnd) weekAmount += t.amount
          // Check in end month if week crosses month boundary
          if (weekEnd.getMonth() !== weekStart.getMonth()) {
            const c2 = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), txDay)
            if (c2 >= weekStart && c2 <= weekEnd) weekAmount += t.amount
          }
        }
        weeklyProjection.push({ label: weekLabel(weekStart, weekEnd), amount: weekAmount })
      }
    }
  }

  const recentTx = isDemo
    ? [...mockTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
    : []

  const chartData = isDemo
    ? [
        { month: '2026-01-01', income: 3_500_000, expenses: 2_300_000, savings: 1_200_000 },
        { month: '2026-02-01', income: 3_100_000, expenses: 2_450_000, savings: 650_000 },
        { month: '2026-03-01', income: 3_800_000, expenses: 2_200_000, savings: 1_600_000 },
        { month: '2026-04-01', income: 4_100_000, expenses: 2_600_000, savings: 1_500_000 },
        { month: '2026-05-01', income: 3_700_000, expenses: 2_400_000, savings: 1_300_000 },
        { month: '2026-06-01', income: cashflow.income, expenses: cashflow.expenses, savings: cashflow.net },
      ]
    : [{ month: new Date().toISOString().slice(0, 7) + '-01', income: cashflow.income, expenses: cashflow.expenses, savings: cashflow.net }]

  const savingsPct = Math.round(cashflow.savingsRate * 100)

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Onboarding checklist for new users */}
      {isDemo && (
        <div className="rounded-[var(--radius-xl)] border border-brand-200 bg-brand-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-brand-600" />
            <p className="text-sm font-semibold text-brand-700">Completa tu perfil para ver tu situación real</p>
          </div>
          <p className="text-xs text-brand-600 mb-4">Ahora mismo estás viendo datos de ejemplo. Sigue estos pasos para personalizar la app:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { href: '/perfil/cuentas', label: '1. Tus cuentas', desc: 'Banco, ahorro, inversiones' },
              { href: '/perfil/transacciones', label: '2. Ingresos y gastos', desc: 'Sueldo, arriendo, servicios' },
              { href: '/perfil/deudas', label: '3. Deudas', desc: 'Créditos, hipoteca, tarjetas' },
              { href: '/perfil/objetivos', label: '4. Objetivos', desc: 'Casa, viaje, emergencia' },
            ].map(step => (
              <Link key={step.href} href={step.href} className="flex flex-col gap-1 rounded-[var(--radius-lg)] bg-white border border-brand-100 p-3 hover:border-brand-300 hover:shadow-sm transition-all">
                <span className="text-xs font-semibold text-brand-700">{step.label}</span>
                <span className="text-[11px] text-brand-500">{step.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Net worth banner */}
      <div className="rounded-[var(--radius-xl)] bg-gradient-to-br from-brand-600 to-brand-800 p-5 sm:p-6 text-white shadow-[var(--shadow-lg)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand-200 mb-1">Patrimonio neto</p>
            <p className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 break-all">
              {formatCurrency(netWorth.netWorth, 'CLP')}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-brand-200">
                Activos {formatCurrency(netWorth.totalAssets, 'CLP')}
              </span>
              <span className="text-brand-300">·</span>
              <span className="text-brand-200">
                Pasivos {formatCurrency(netWorth.totalLiabilities, 'CLP')}
              </span>
            </div>
          </div>
          <HealthScoreRing score={capacity.financialHealthScore} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Ingresos del mes"
          value={formatCurrency(cashflow.income, 'CLP')}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="success"
        />
        <StatCard
          label="Gastos del mes"
          value={formatCurrency(cashflow.expenses, 'CLP')}
          icon={<TrendingDown className="h-4 w-4" />}
          accent="danger"
        />
        <StatCard
          label="Tasa de ahorro"
          value={formatPercent(savingsPct, 0)}
          trend={savingsPct >= 20 ? 0 : -1}
          trendLabel={savingsPct >= 20 ? 'Meta cumplida' : 'Bajo el 20%'}
          icon={<Wallet className="h-4 w-4" />}
          accent={savingsPct >= 20 ? 'success' : 'warning'}
        />
        <StatCard
          label="Liquidez disponible"
          value={formatCurrency(netWorth.liquidAssets, 'CLP')}
          icon={<ShieldCheck className="h-4 w-4" />}
          accent="brand"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left/center col */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Flujo de caja — últimos 6 meses</CardTitle>
            </CardHeader>
            <CardContent>
              <CashflowChart data={chartData} />
            </CardContent>
          </Card>

          {/* Category breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Gastos por categoría — este mes</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryBreakdown.length === 0 ? (
                <p className="text-sm text-foreground-muted text-center py-6">Sin gastos registrados este mes.</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-foreground-muted mb-1">
                    <span>Ingresos del mes</span>
                    <span className="font-semibold text-success">{formatCurrency(incomeTotal, 'CLP')}</span>
                  </div>
                  {categoryBreakdown.map(c => (
                    <div key={c.name} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground font-medium">{c.name}</span>
                        <span className="text-foreground-muted">{formatCurrency(c.amount, 'CLP')} <span className="text-foreground-subtle">({c.percentage}%)</span></span>
                      </div>
                      <div className="h-1.5 rounded-full bg-border-subtle overflow-hidden">
                        <div className="h-full rounded-full bg-danger/60" style={{ width: `${c.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly projection */}
          <Card>
            <CardHeader>
              <CardTitle>Gastos proyectados — próximas 4 semanas</CardTitle>
            </CardHeader>
            <CardContent>
              {weeklyProjection.every(w => w.amount === 0) ? (
                <p className="text-sm text-foreground-muted text-center py-6">No tienes gastos recurrentes configurados.</p>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    const max = Math.max(...weeklyProjection.map(w => w.amount), 1)
                    return weeklyProjection.map(w => (
                      <div key={w.label} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground font-medium">{w.label}</span>
                          <span className="text-foreground-muted">{formatCurrency(w.amount, 'CLP')}</span>
                        </div>
                        <div className="h-2 rounded-full bg-border-subtle overflow-hidden">
                          <div className="h-full rounded-full bg-brand-500/70" style={{ width: `${Math.round(w.amount / max * 100)}%` }} />
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              )}
            </CardContent>
          </Card>

          <RecentTransactions transactions={recentTx} categories={mockCategories} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Rules alerts */}
          {rules.violations.length > 0 && (
            <Card className="border-warning/40 bg-warning-bg/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-semibold text-foreground">Alertas financieras</span>
                </div>
                <ul className="space-y-2">
                  {rules.violations.map((v) => (
                    <li key={v.ruleId} className="flex items-center justify-between text-xs">
                      <span className="text-foreground-muted">{v.label}</span>
                      <Badge variant={v.priority === 'critical' ? 'danger' : 'warning'} size="sm">
                        {v.priority === 'critical' ? 'Crítico' : 'Alto'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <UpcomingEvents events={[]} />

          <div>
            <h2 className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">
              Objetivos activos
            </h2>
            <div className="space-y-3">
              {goals.objectives.slice(0, 3).map((obj) => (
                <GoalCard key={obj.id} objective={obj} />
              ))}
            </div>
          </div>

          {/* Debt summary */}
          {debt.totalDebt > 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">Deuda activa</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground-muted">Total pendiente</span>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(debt.totalDebt, 'CLP')}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-foreground-muted">Cuota mensual</span>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(debt.totalMonthlyPayment, 'CLP')}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-foreground-muted">DTI</span>
                  <Badge variant={debt.riskLevel === 'low' ? 'success' : 'warning'} size="sm">
                    {formatPercent(debt.debtToIncomeRatio * 100, 1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
