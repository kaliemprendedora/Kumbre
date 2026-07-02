'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const COLORS = [
  'var(--danger)',
  'var(--brand-500)',
  'var(--warning)',
  'var(--success)',
  '#8b5cf6',
  '#f59e42',
]

interface CategoryTrendChartProps {
  data: Record<string, string | number>[]
  categories: string[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-3 text-xs space-y-1.5">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-foreground-muted">{entry.name}:</span>
          <span className="font-medium text-foreground">{formatCurrency(entry.value, 'CLP')}</span>
        </div>
      ))}
    </div>
  )
}

export function CategoryTrendChart({ data, categories }: CategoryTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
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
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
        {categories.map((cat, i) => (
          <Line
            key={cat}
            type="monotone"
            dataKey={cat}
            name={cat}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}