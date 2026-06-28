import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDateShort } from '@/lib/utils'
import type { Transaction, Category } from '@/types'

interface RecentTransactionsProps {
  transactions: Transaction[]
  categories: Category[]
}

export function RecentTransactions({ transactions, categories }: RecentTransactionsProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Últimos movimientos</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-0 pb-2">
        <ul className="divide-y divide-border">
          {transactions.map((tx) => {
            const cat = tx.categoryId ? categoryMap.get(tx.categoryId) : undefined
            const isIncome = tx.type === 'income'
            return (
              <li key={tx.id} className="flex items-center gap-3 px-5 py-3 hover:bg-border-subtle transition-colors">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isIncome ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
                  }`}
                >
                  {isIncome ? (
                    <ArrowDownLeft className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  )}
                </div>
                <div className="flex flex-1 min-w-0 flex-col">
                  <span className="text-sm font-medium text-foreground truncate">{tx.description}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-foreground-muted">{formatDateShort(tx.date)}</span>
                    {cat && (
                      <>
                        <span className="text-foreground-subtle text-[10px]">·</span>
                        <Badge variant="muted" size="sm" style={{ backgroundColor: cat.color + '20', color: cat.color }}>
                          {cat.name}
                        </Badge>
                      </>
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
  )
}
