'use client'

import { Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { ObjectiveDetail } from '@/engine/types/outputs'

interface GoalCardProps {
  objective: ObjectiveDetail
}

export function GoalCard({ objective }: GoalCardProps) {
  const isAtRisk = objective.isAtRisk
  const pct = Math.round(objective.progressPercent)
  const remaining = objective.remaining

  return (
    <Card className="hover:shadow-[var(--shadow-md)] transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-brand-50">
              <Target className="h-4 w-4 text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-none">{objective.name}</p>
              <p className="text-xs text-foreground-muted mt-0.5">{objective.monthsUntilTarget} meses restantes</p>
            </div>
          </div>
          <Badge variant={isAtRisk ? 'warning' : 'success'} size="sm">
            {isAtRisk ? 'En riesgo' : 'En camino'}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-foreground font-medium">{formatCurrency(objective.currentAmount, 'CLP')}</span>
            <span className="text-foreground-muted">{formatCurrency(objective.targetAmount, 'CLP')}</span>
          </div>
          <Progress value={pct} color={isAtRisk ? 'warning' : 'brand'} size="sm" />
          <div className="flex justify-between text-[10px] text-foreground-subtle">
            <span>{formatPercent(pct, 0)} completado</span>
            <span>{formatCurrency(remaining, 'CLP')} restante</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
