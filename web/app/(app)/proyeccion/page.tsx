import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProyeccionClient } from './ProyeccionClient'

export const metadata: Metadata = { title: 'Proyección' }

export default async function ProyeccionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [txsRes, cuentasRes] = await Promise.all([
    supabase.from('transactions').select('*').eq('user_id', user!.id),
    supabase.from('accounts').select('*').eq('user_id', user!.id),
  ])

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div>
        <h1 className="text-xl font-bold text-foreground">Proyección financiera</h1>
        <p className="text-sm text-foreground-muted mt-1">
          Basado en tus ingresos y gastos recurrentes. Puedes marcar cuentas y movimientos como "Negocio" en Mi Perfil para separarlos.
        </p>
      </div>
      <ProyeccionClient
        txs={txsRes.data ?? []}
        cuentas={cuentasRes.data ?? []}
      />
    </div>
  )
}
