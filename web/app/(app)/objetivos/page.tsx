import type { Metadata } from 'next'
import Link from 'next/link'
import { Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { getAnalysisForUser } from '@/lib/kumbre'

export const metadata: Metadata = { title: 'Objetivos' }

export default async function ObjetivosPage() {
  const { goals, cashflow } = await getAnalysisForUser()

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Header stats */}
      <div className="flex items-start justify-between gap-4">
        <div className="grid grid-cols-3 gap-4 flex-1">
          <div className="rounded-[var(--radius-lg)] bg-surface-raised border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">Total necesario</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(goals.totalRequired, 'CLP')}</p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-surface-raised border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">Ya acumulado</p>
            <p className="text-lg font-bold text-success">{formatCurrency(goals.totalCurrent, 'CLP')}</p>
          </div>
          <div className="rounded-[var(--radius-lg)] bg-surface-raised border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">Ahorro requerido/mes</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(goals.totalMonthlyRequired, 'CLP')}</p>
          </div>
        </div>
        <Link href="/perfil/objetivos">
          <Button variant="primary" size="sm">
            <Target className="h-3.5 w-3.5" />
            Nuevo objetivo
          </Button>
        </Link>
      </div>

      {/* Feasibility alert */}
      {goals.totalMonthlyRequired > cashflow.net && (
        <div className="flex items-start gap-3 rounded-[var(--radius-lg)] bg-warning-bg border border-warning/30 p-4">
          <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Objetivos en conflicto</p>
            <p className="text-xs text-foreground-muted mt-0.5">
              Necesitas {formatCurrency(goals.totalMonthlyRequired, 'CLP')}/mes pero tu flujo libre es {formatCurrency(cashflow.net, 'CLP')}/mes.
              Considera reorganizar prioridades o reducir gastos.
            </p>
          </div>
        </div>
      )}

      {/* Objectives grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {goals.objectives.map((obj) => (
          <ObjectiveDetailCard key={obj.id} objective={obj} />
        ))}
      </div>
    </div>
  )
}

function ObjectiveDetailCard({ objective }: { objective: import('@/engine/types/outputs').ObjectiveDetail }) {
  const pct = Math.round(objective.progressPercent)
  const isCritical = objective.monthsUntilTarget <= 3 && objective.isAtRisk
  const isCompleted = objective.remaining === 0

  return (
    <Card className="hover:shadow-[var(--shadow-md)] transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] ${
              isCompleted ? 'bg-success-bg' : objective.isAtRisk ? 'bg-warning-bg' : 'bg-brand-50'
            }`}>
              {isCompleted ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <Target className={`h-5 w-5 ${objective.isAtRisk ? 'text-warning' : 'text-brand-600'}`} />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-none">{objective.name}</p>
              <p className="text-xs text-foreground-muted mt-0.5">Prioridad {objective.targetAmount > 0 ? '#' : ''}{objective.monthsUntilTarget} meses</p>
            </div>
          </div>
          <Badge
            variant={isCompleted ? 'success' : isCritical ? 'danger' : objective.isAtRisk ? 'warning' : 'success'}
            size="sm"
          >
            {isCompleted ? 'Completado' : isCritical ? 'Urgente' : objective.isAtRisk ? 'En riesgo' : 'En camino'}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-foreground font-semibold">{formatCurrency(objective.currentAmount, 'CLP')}</span>
            <span className="text-foreground-muted">{formatCurrency(objective.targetAmount, 'CLP')}</span>
          </div>
          <Progress
            value={pct}
            color={isCompleted ? 'success' : objective.isAtRisk ? 'warning' : 'brand'}
            size="md"
          />
          <p className="text-[10px] text-foreground-subtle">{formatPercent(pct, 0)} completado</p>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-border">
          <Row label="Faltan" value={formatCurrency(objective.remaining, 'CLP')} />
          <Row label="Necesario/mes" value={formatCurrency(objective.requiredMonthlySaving, 'CLP')} />
          <Row label="Actual/mes" value={formatCurrency(objective.currentMonthlySaving, 'CLP')} highlight={objective.surplusOrDeficit < 0 ? 'danger' : 'success'} />
          {objective.surplusOrDeficit !== 0 && (
            <Row
              label={objective.surplusOrDeficit < 0 ? 'Déficit mensual' : 'Excedente mensual'}
              value={formatCurrency(Math.abs(objective.surplusOrDeficit), 'CLP')}
              highlight={objective.surplusOrDeficit < 0 ? 'danger' : 'success'}
            />
          )}
        </div>

        {!isCompleted && (
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
            <span className="text-foreground-muted flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Proyección actual
            </span>
            <span className="font-medium text-foreground">
              {objective.monthsRemaining >= 9999
                ? 'Indeterminado'
                : `${objective.monthsRemaining} meses`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: 'success' | 'danger'
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-foreground-muted">{label}</span>
      <span className={`font-semibold ${
        highlight === 'success' ? 'text-success' : highlight === 'danger' ? 'text-danger' : 'text-foreground'
      }`}>{value}</span>
    </div>
  )
}
