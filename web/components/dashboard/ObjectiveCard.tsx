import { Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, progressPercent, monthsUntil } from '@/lib/utils'
import type { Objective } from '@/types'

interface ObjectiveCardProps {
  objective: Objective
}

const statusVariant: Record<string, 'success' | 'warning' | 'brand' | 'danger'> = {
  on_track: 'success',
  at_risk: 'warning',
  completed: 'success',
  paused: 'danger',
}

const statusLabel: Record<string, string> = {
  on_track: 'En camino',
  at_risk: 'En riesgo',
  completed: 'Completado',
  paused: 'Pausado',
}

export function ObjectiveCard({ objective }: ObjectiveCardProps) {
  const target = objective.targetAmount ?? 0
  const pct = progressPercent(objective.currentAmount, target)
  const remaining = target - objective.currentAmount
  const months = objective.targetDate ? monthsUntil(objective.targetDate) : null

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
              {months !== null && (
                <p className="text-xs text-foreground-muted mt-0.5">{months} meses restantes</p>
              )}
            </div>
          </div>
          <Badge variant={statusVariant[objective.status] ?? 'muted'} size="sm">
            {statusLabel[objective.status] ?? objective.status}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-foreground font-medium">{formatCurrency(objective.currentAmount, 'CLP')}</span>
            <span className="text-foreground-muted">{formatCurrency(target, 'CLP')}</span>
          </div>
          <Progress value={pct} color={objective.status === 'at_risk' ? 'warning' : 'brand'} size="sm" />
          <div className="flex justify-between text-[10px] text-foreground-subtle">
            <span>{pct}% completado</span>
            <span>{formatCurrency(remaining, 'CLP')} restante</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
