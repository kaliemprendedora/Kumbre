import type { Metadata } from 'next'
import { ArrowDownLeft, ArrowUpRight, Search, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { mockTransactions, mockCategories, mockAccounts } from '@/data/mock'

export const metadata: Metadata = { title: 'Movimientos' }

export default function MovimientosPage() {
  const categoryMap = new Map(mockCategories.map((c) => [c.id, c]))
  const accountMap = new Map(mockAccounts.map((a) => [a.id, a]))

  const sorted = [...mockTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <Input
            placeholder="Buscar movimientos..."
            startAdornment={<Search className="h-3.5 w-3.5" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Filter className="h-3.5 w-3.5" />
            Filtrar
          </Button>
          <Button variant="primary" size="sm">
            + Movimiento
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {sorted.map((tx) => {
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
