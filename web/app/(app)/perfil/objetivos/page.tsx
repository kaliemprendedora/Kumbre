import type { Metadata } from 'next'
import { ObjetivosClient } from './ObjetivosClient'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Objetivos' }

export default async function ObjetivosPerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: objetivos } = await supabase.from('objectives').select('*').eq('user_id', user!.id).order('created_at')
  return <ObjetivosClient initial={objetivos ?? []} />
}
