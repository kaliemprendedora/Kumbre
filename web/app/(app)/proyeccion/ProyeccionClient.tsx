'use client'

import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

type Tx = { id: string; amount: number; kind: string; is_recurring: boolean; is_business: boolean; date: string; description: string; account_id: string }
type Cuenta = { id: string; name: string; balance: number; is_business: boolean }

type ViewMode = 'personal' | 'negocio' | 'ambos'
type Horizon = 1 | 2 | 3 | 5 | 10

function formatM(date: Date) {
  return date.toLocaleDateString('es-CL', { month: 'short', year: '2-digit' })
}

function buildProjection(txs: Tx[], cuentas: Cuenta[], mode: ViewMode, horizonYears: Horizon) {
  const now = new Date()
  const months = horizonYears * 12

  const recurring = txs.filter(t => t.is_recurring)
  const oneOff = txs.filter(t => !t.is_recurring)

  const filterByMode = (isBusiness: boolean) => {
    if (mode === 'personal') return !isBusiness
    if (mode === 'negocio') return isBusiness
    return true
  }

  const initialBalance = cuentas
    .filter(c => filterByMode(c.is_business))
    .reduce((s, c) => s + c.balance, 0)

  let runningBalance = initialBalance

  const data = Array.from({ length: months }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    // Recurring transactions
    const recIncome = recurring
      .filter(t => t.kind === 'income' && filterByMode(t.is_business))
      .reduce((s, t) => s + t.amount, 0)
    const recExpense = recurring
      .filter(t => t.kind === 'expense' && filterByMode(t.is_business))
      .reduce((s, t) => s + t.amount, 0)

    // One-off transactions in this month
    const monthOneOff = oneOff.filter(t => t.date.startsWith(monthStr) && filterByMode(t.is_business))
    const oneOffIncome = monthOneOff.filter(t => t.kind === 'income').reduce((s, t) => s + t.amount, 0)
    const oneOffExpense = monthOneOff.filter(t => t.kind === 'expense').reduce((s, t) => s + t.amount, 0)

    const income = recIncome + oneOffIncome
    const expense = recExpense + oneOffExpense
    const net = income - expense
    runningBalance += net

    return {
      label: formatM(date),
      Ingresos: income,
      Gastos: expense,
      Ahorro: net,
      Patrimonio: runningBalance,
    }
  })

  return { data, initialBalance }
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-3 text-xs space-y-1.5 min-w-[180px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: e.color }} />
            <span className="text-foreground-muted">{e.name}</span>
          </div>
          <span className="font-medium text-foreground">{formatCurrency(e.value, 'CLP')}</span>
        </div>
      ))}
    </div>
  )
}

export function ProyeccionClient({ txs, cuentas }: { txs: Tx[]; cuentas: Cuenta[] }) {
  const [mode, setMode] = useState<ViewMode>('ambos')
  const [horizon, setHorizon] = useState<Horizon>(1)
  const [chartType, setChartType] = useState<'flujo' | 'patrimonio'>('flujo')

  const { data, initialBalance } = useMemo(
    () => buildProjection(txs, cuentas, mode, horizon),
    [txs, cuentas, mode, horizon]
  )

  const totalIncome = data.reduce((s, d) => s + d.Ingresos, 0)
  const totalExpense = data.reduce((s, d) => s + d.Gastos, 0)
  const totalNet = totalIncome - totalExpense
  const finalBalance = data[data.length - 1]?.Patrimonio ?? initialBalance

  // Show fewer X-axis ticks so labels don't overlap on mobile
  const tickInterval = horizon <= 1 ? 1 : horizon <= 2 ? 2 : horizon <= 3 ? 3 : horizon <= 5 ? 5 : 11

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Mode */}
        <div className="flex rounded-[var(--radius-md)] border border-border overflow-hidden text-xs">
          {(['ambos', 'personal', 'negocio'] as ViewMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1.5 capitalize transition-colors ${mode === m ? 'bg-brand-600 text-white font-medium' : 'text-foreground-muted hover:bg-border-subtle'}`}
            >
              {m === 'ambos' ? 'Ambos' : m === 'personal' ? 'Personal' : 'Negocio'}
            </button>
          ))}
        </div>

        {/* Horizon */}
        <div className="flex rounded-[var(--radius-md)] border border-border overflow-hidden text-xs">
          {([1, 2, 3, 5, 10] as Horizon[]).map(h => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 transition-colors ${horizon === h ? 'bg-brand-600 text-white font-medium' : 'text-foreground-muted hover:bg-border-subtle'}`}
            >
              {h} {h === 1 ? 'año' : 'años'}
            </button>
          ))}
        </div>

        {/* Chart type */}
        <div className="flex rounded-[var(--radius-md)] border border-border overflow-hidden text-xs ml-auto">
          <button onClick={() => setChartType('flujo')} className={`px-3 py-1.5 transition-colors ${chartType === 'flujo' ? 'bg-brand-600 text-white font-medium' : 'text-foreground-muted hover:bg-border-subtle'}`}>
            Flujo mensual
          </button>
          <button onClick={() => setChartType('patrimonio')} className={`px-3 py-1.5 transition-colors ${chartType === 'patrimonio' ? 'bg-brand-600 text-white font-medium' : 'text-foreground-muted hover:bg-border-subtle'}`}>
            Patrimonio
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-[var(--radius-lg)] bg-surface-raised border border-border p-4">
          <p className="text-xs text-foreground-muted mb-1">Ingresos proyectados</p>
          <p className="text-base font-bold text-success">{formatCurrency(totalIncome, 'CLP')}</p>
          <p className="text-[10px] text-foreground-subtle mt-0.5">en {horizon} {horizon === 1 ? 'año' : 'años'}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-surface-raised border border-border p-4">
          <p className="text-xs text-foreground-muted mb-1">Gastos proyectados</p>
          <p className="text-base font-bold text-danger">{formatCurrency(totalExpense, 'CLP')}</p>
          <p className="text-[10px] text-foreground-subtle mt-0.5">en {horizon} {horizon === 1 ? 'año' : 'años'}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-surface-raised border border-border p-4">
          <p className="text-xs text-foreground-muted mb-1">Ahorro neto</p>
          <p className={`text-base font-bold ${totalNet >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(totalNet, 'CLP')}</p>
          <p className="text-[10px] text-foreground-subtle mt-0.5">en {horizon} {horizon === 1 ? 'año' : 'años'}</p>
        </div>
        <div className="rounded-[var(--radius-lg)] bg-surface-raised border border-border p-4">
          <p className="text-xs text-foreground-muted mb-1">Patrimonio final</p>
          <p className={`text-base font-bold ${finalBalance >= 0 ? 'text-foreground' : 'text-danger'}`}>{formatCurrency(finalBalance, 'CLP')}</p>
          <p className="text-[10px] text-foreground-subtle mt-0.5">desde {formatCurrency(initialBalance, 'CLP')}</p>
        </div>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{chartType === 'flujo' ? 'Flujo mensual proyectado' : 'Evolución del patrimonio'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'flujo' ? (
              <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barSize={horizon <= 2 ? 8 : 4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--foreground-muted)' }} axisLine={false} tickLine={false} interval={tickInterval} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--foreground-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                <ReferenceLine y={0} stroke="var(--border)" />
                <Bar dataKey="Ingresos" fill="var(--success)" opacity={0.8} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Gastos" fill="var(--danger)" opacity={0.8} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Ahorro" fill="var(--brand-500, #6366f1)" opacity={0.9} radius={[2, 2, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }} barSize={horizon <= 2 ? 8 : 4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--foreground-muted)' }} axisLine={false} tickLine={false} interval={tickInterval} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--foreground-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1_000_000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="var(--border)" />
                <Bar dataKey="Patrimonio" fill="var(--brand-600, #4f46e5)" radius={[2, 2, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly table — show only for short horizons */}
      {horizon <= 2 && (
        <Card>
          <CardHeader><CardTitle>Detalle mensual</CardTitle></CardHeader>
          <CardContent className="p-0 pb-2">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[400px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-3 text-foreground-muted font-medium whitespace-nowrap">Mes</th>
                    <th className="text-right px-3 py-3 text-foreground-muted font-medium whitespace-nowrap">Ingresos</th>
                    <th className="text-right px-3 py-3 text-foreground-muted font-medium whitespace-nowrap">Gastos</th>
                    <th className="text-right px-3 py-3 text-foreground-muted font-medium whitespace-nowrap">Ahorro</th>
                    <th className="text-right px-3 py-3 text-foreground-muted font-medium whitespace-nowrap">Patrimonio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-border-subtle transition-colors">
                      <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{row.label}</td>
                      <td className="px-3 py-2.5 text-right text-success whitespace-nowrap">{formatCurrency(row.Ingresos, 'CLP')}</td>
                      <td className="px-3 py-2.5 text-right text-danger whitespace-nowrap">{formatCurrency(row.Gastos, 'CLP')}</td>
                      <td className={`px-3 py-2.5 text-right font-semibold whitespace-nowrap ${row.Ahorro >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(row.Ahorro, 'CLP')}</td>
                      <td className={`px-3 py-2.5 text-right font-semibold whitespace-nowrap ${row.Patrimonio >= 0 ? 'text-foreground' : 'text-danger'}`}>{formatCurrency(row.Patrimonio, 'CLP')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
