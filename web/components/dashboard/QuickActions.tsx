'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ScanReceiptButton } from '@/components/movimientos/ScanReceiptButton'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  name: string
  kind: string
}

interface Account {
  id: string
  name: string
  is_business: boolean
}

interface QuickActionsProps {
  categories: Category[]
  accounts: Account[]
}

export function QuickActions({ categories, accounts }: QuickActionsProps) {
  const router = useRouter()

  const categoriesForScan = categories.map(c => ({
    id: c.id,
    name: c.name,
    color: '#888',
    type: c.kind,
  }))

  async function handleSaveScanned(scanned: Array<{
    date: string; description: string; amount: number
    type: 'expense' | 'income'; rawText: string; categoryId?: string
  }>) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const defaultAccount = accounts.find(a => !a.is_business) ?? accounts[0]
    if (!defaultAccount) {
      alert('Primero agrega una cuenta en Perfil -> Cuentas')
      return
    }
    const rows = scanned.map(tx => ({
      user_id: user.id,
      description: tx.description,
      amount: tx.amount,
      kind: tx.type,
      date: tx.date,
      account_id: defaultAccount.id,
      category_id: tx.categoryId ?? null,
      is_recurring: false,
      is_business: false,
    }))
    const { error } = await supabase.from('transactions').insert(rows)
    if (error) throw new Error(error.message)
    router.refresh()
  }

  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-5">
      <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">Registrar movimiento</p>
      <div className="flex flex-wrap gap-3 items-start">
        <ScanReceiptButton categories={categoriesForScan} onSave={handleSaveScanned} />
        <Button variant="secondary" size="sm" asChild>
          <Link href="/movimientos?new=1">
            <Plus className="h-3.5 w-3.5" />
            Ingresar manualmente
          </Link>
        </Button>
      </div>
    </div>
  )
}