'use client'

import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  trackClassName?: string
  color?: 'brand' | 'success' | 'warning' | 'danger'
  size?: 'xs' | 'sm' | 'md'
  animated?: boolean
}

const colorMap = {
  brand: 'bg-brand-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

const sizeMap = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2',
}

export function Progress({
  value,
  max = 100,
  className,
  trackClassName,
  color = 'brand',
  size = 'sm',
  animated = false,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      aria-valuemin={0}
      className={cn('w-full overflow-hidden rounded-full bg-border-subtle', sizeMap[size], className)}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500',
          colorMap[color],
          animated && 'animate-pulse',
          trackClassName
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
