'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency, formatMonthYear } from '@/lib/utils'
import type { MonthlyCashflow } from '@/types'

interface CashflowChartProps {
  data: MonthlyCashflow[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-3 text-xs space-y-1.5">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-foreground-muted capitalize">{entry.name}:</span>
          <span className="font-medium text-foreground">{formatCurrency(entry.value, 'CLP')}</span>
        </div>
      ))}
    </div>
  )
}

export function CashflowChart({ data }: CashflowChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    month: formatMonthYear(d.month).slice(0, 3) + ' ' + new Date(d.month).getFullYear().toString().slice(-2),
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--success)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradGastos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.12} />
            <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--foreground-muted)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
        />
        <Area
          type="monotone"
          dataKey="income"
          name="Ingresos"
          stroke="var(--success)"
          strokeWidth={2}
          fill="url(#gradIngresos)"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          name="Gastos"
          stroke="var(--danger)"
          strokeWidth={2}
          fill="url(#gradGastos)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
