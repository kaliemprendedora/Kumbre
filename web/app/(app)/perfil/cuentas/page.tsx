import type { Metadata } from 'next'
import { CuentasClient } from './CuentasClient'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Cuentas' }

export default async function CuentasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: cuentas } = await supabase.from('accounts').select('*').eq('user_id', user!.id).order('created_at')
  return <CuentasClient initial={cuentas ?? []} />
}
