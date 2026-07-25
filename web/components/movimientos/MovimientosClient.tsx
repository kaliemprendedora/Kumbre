'use client'

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ScanReceiptButton } from './ScanReceiptButton'

interface Category {
  id: string
  name: string
  color: string
  type: string
}

interface Account {
  id: string
  name: string
}

interface Transaction {
  id: string
  description: string
  date: string
  type: 'income' | 'expense' | 'transfer'
  amount: number
  categoryId?: string
  accountId: string
}

interface ReviewTransaction {
  date: string
  description: string
  amount: number
  type: 'expense' | 'income'
  rawText: string
  categoryId?: string
}

interface MovimientosClientProps {
  transactions: Transaction[]
  categories: Category[]
  accounts: Account[]
  categoryMap: Map<string, Category>
  accountMap: Map<string, Account>
}

export function MovimientosClient({
  transactions,
  categories,
  accounts,
  categoryMap,
  accountMap,
}: MovimientosClientProps) {

  async function handleSaveScanned(scanned: ReviewTransaction[]) {
    console.log('Saving scanned transactions:', scanned)
    alert(`Se guardarán ${scanned.length} movimiento(s). (Integración con base de datos próximamente)`)
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="rounded-[var(--radius-xl)] border-2 border-dashed border-brand-300 bg-brand-50 dark:bg-brand-950/20 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground mb-0.5">Registra tus gastos al instante</p>
          <p className="text-xs text-foreground-muted">Saca foto a tu boleta y la app detecta los movimientos automáticamente</p>
        </div>
        <ScanReceiptButton
          categories={categories}
          onSave={handleSaveScanned}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <input
            placeholder="Buscar movimientos..."
            className="w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors">
            Filtrar
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
            + Movimiento
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {transactions.map((tx) => {
              const cat = tx.categoryId ? categoryMap.get(tx.categoryId) : undefined
              const account = accountMap.get(tx.accountId)
              const isIncome = tx.type === 'income'

              return (
                <li
                  key={tx.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-border-subtle transition-colors cursor-pointer"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isIncome ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex flex-1 min-w-0 flex-col gap-1">
                    <span className="text-sm font-medium text-foreground">{tx.description}</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-foreground-muted">{formatDate(tx.date)}</span>
                      {account && (
                        <>
                          <span className="text-foreground-subtle text-xs">·</span>
                          <span className="text-xs text-foreground-muted">{account.name}</span>
                        </>
                      )}
                      {cat && (
                        <Badge
                          variant="muted"
                          size="sm"
                          style={{ backgroundColor: cat.color + '20', color: cat.color }}
                        >
                          {cat.name}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-sm font-semibold shrink-0 ${
                      isIncome ? 'text-success' : 'text-foreground'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(Math.abs(tx.amount), 'CLP')}
                  </span>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
