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
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <span className="text-xs font-medium text-foreground-muted uppercase tracking-wide">{label}</span>
            <span className="text-2xl font-bold text-foreground tracking-tight leading-none">{value}</span>
            {trend !== undefined && (
              <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
                <TrendIcon className="h-3 w-3 shrink-0" />
                {trend > 0 ? '+' : ''}{trend}% {trendLabel ?? 'vs mes anterior'}
              </div>
            )}
          </div>
          {icon && (
            <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)]', accentMap[accent])}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
