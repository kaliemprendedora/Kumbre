import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MovimientosClient } from './MovimientosClient'

export const metadata: Metadata = { title: 'Movimientos' }

export default async function MovimientosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [txsRes, cuentasRes, catsRes] = await Promise.all([
    supabase.from('transactions').select('*').eq('user_id', user!.id).order('date', { ascending: false }),
    supabase.from('accounts').select('id, name, is_business').eq('user_id', user!.id),
    supabase.from('categories').select('*').eq('user_id', user!.id).order('name'),
  ])

  return (
    <MovimientosClient
      initial={txsRes.data ?? []}
      cuentas={cuentasRes.data ?? []}
      initialCategories={catsRes.data ?? []}
    />
  )
}
