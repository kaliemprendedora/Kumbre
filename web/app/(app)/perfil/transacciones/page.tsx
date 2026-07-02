import type { Metadata } from 'next'
import { TransaccionesClient } from './TransaccionesClient'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Ingresos y Gastos' }

export default async function TransaccionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [{ data: txs }, { data: cuentas }, { data: categories }] = await Promise.all([
    supabase.from('transactions').select('*').eq('user_id', user!.id).order('date', { ascending: false }),
    supabase.from('accounts').select('id, name, is_business').eq('user_id', user!.id),
    supabase.from('categories').select('*').eq('user_id', user!.id).order('name'),
  ])
  return <TransaccionesClient initial={txs ?? []} cuentas={cuentas ?? []} initialCategories={categories ?? []} />
}