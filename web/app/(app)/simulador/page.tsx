import type { Metadata } from 'next'
import { SimuladorClient } from '@/components/simulador/SimuladorClient'
import { snapshot } from '@/lib/kumbre'

export const metadata: Metadata = { title: 'Simulador' }

export default function SimuladorPage() {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <SimuladorClient snapshot={snapshot} />
    </div>
  )
}
