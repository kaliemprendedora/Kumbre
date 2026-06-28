import type { Metadata } from 'next'
import { TrendingUp, Lightbulb } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata: Metadata = { title: 'Simulador' }

export default function SimuladorPage() {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-xl)] bg-brand-50">
            <TrendingUp className="h-7 w-7 text-brand-600" />
          </div>
          <div>
            <h2 className="text-h3 text-foreground mb-1">Simulador financiero</h2>
            <p className="text-sm text-foreground-muted max-w-sm">
              Simula el impacto de tus decisiones financieras — compras, inversiones y objetivos — antes de tomarlas.
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-[var(--radius-md)] bg-warning-bg px-4 py-2.5">
            <Lightbulb className="h-4 w-4 text-warning shrink-0" />
            <span className="text-xs text-foreground-muted">Disponible en Sprint 3</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
