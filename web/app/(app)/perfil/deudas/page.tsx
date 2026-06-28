import type { Metadata } from 'next'
import { DeudasClient } from './DeudasClient'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Deudas' }

export default async function DeudasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: deudas } = await supabase.from('debts').select('*').eq('user_id', user!.id).order('created_at')
  return <DeudasClient initial={deudas ?? []} />
}
