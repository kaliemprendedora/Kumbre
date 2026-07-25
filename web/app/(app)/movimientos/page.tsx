import type { Metadata } from 'next'
import { mockTransactions, mockCategories, mockAccounts } from '@/data/mock'
import { MovimientosClient } from '@/components/movimientos/MovimientosClient'

export const metadata: Metadata = { title: 'Movimientos' }

export default function MovimientosPage() {
  const categoryMap = new Map(mockCategories.map((c) => [c.id, c]))
  const accountMap = new Map(mockAccounts.map((a) => [a.id, a]))

  const sorted = [...mockTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <MovimientosClient
      transactions={sorted}
      categories={mockCategories}
      accounts={mockAccounts}
      categoryMap={categoryMap}
      accountMap={accountMap}
    />
  )
}
