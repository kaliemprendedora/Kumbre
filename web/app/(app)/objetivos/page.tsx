import type { Metadata } from 'next'
import { Target } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ObjectiveCard } from '@/components/dashboard/ObjectiveCard'
import { mockObjectives } from '@/data/mock'
import { formatCurrency } from '@/lib/utils'

export const metadata: Metadata = { title: 'Objetivos' }

export default function ObjetivosPage() {
  const totalTarget = mockObjectives.reduce((s, o) => s + (o.targetAmount ?? 0), 0)
  const totalCurrent = mockObjectives.reduce((s, o) => s + o.currentAmount, 0)

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-foreground-muted">
            {formatCurrency(totalCurrent, 'CLP')} de {formatCurrency(totalTarget, 'CLP')} guardados
          </p>
        </div>
        <Button variant="primary" size="sm">
          <Target className="h-3.5 w-3.5" />
          Nuevo objetivo
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockObjectives.map((obj) => (
          <ObjectiveCard key={obj.id} objective={obj} />
        ))}
      </div>
    </div>
  )
}
