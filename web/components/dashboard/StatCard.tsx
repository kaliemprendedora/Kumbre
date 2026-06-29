import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  trend?: number
  trendLabel?: string
  icon?: React.ReactNode
  className?: string
  accent?: 'brand' | 'success' | 'warning' | 'danger'
}

const accentMap = {
  brand: 'text-brand-600 bg-brand-50',
  success: 'text-success bg-success-bg',
  warning: 'text-warning bg-warning-bg',
  danger: 'text-danger bg-danger-bg',
}

export function StatCard({ label, value, trend, trendLabel, icon, className, accent = 'brand' }: StatCardProps) {
  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown
  const trendColor = trend === undefined || trend === 0 ? 'text-foreground-muted' : trend > 0 ? 'text-success' : 'text-danger'

  return (
    <Card className={cn('hover:shadow-[var(--shadow-md)] transition-shadow', className)}>
      <CardContent className="p-4">
        {/* Icon + label row */}
        <div className="flex items-center gap-2 mb-2">
          {icon && (
            <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-md)]', accentMap[accent])}>
              {icon}
            </div>
          )}
          <span className="text-xs font-medium text-foreground-muted leading-tight">{label}</span>
        </div>
        {/* Value */}
        <p className="text-xl font-bold text-foreground tracking-tight leading-none truncate">{value}</p>
        {/* Trend */}
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-medium mt-1.5', trendColor)}>
            <TrendIcon className="h-3 w-3 shrink-0" />
            <span className="truncate">{trend > 0 ? '+' : ''}{trend}% {trendLabel ?? 'vs mes anterior'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
