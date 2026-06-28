import type { Metadata } from 'next'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { mockAccounts, mockNetWorth } from '@/data/mock'

export const metadata: Metadata = { title: 'Patrimonio' }

export default function PatrimonioPage() {
  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Summary banner */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-foreground-muted mb-2">Activos totales</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(mockNetWorth.totalAssets, 'CLP')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-foreground-muted mb-2">Pasivos totales</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(mockNetWorth.totalLiabilities, 'CLP')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-foreground-muted mb-2">Patrimonio neto</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(mockNetWorth.netWorth, 'CLP')}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-success mt-1">
                <TrendingUp className="h-3.5 w-3.5" />
                +{mockNetWorth.trend}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Cuentas y activos</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <ul className="divide-y divide-border">
            {mockAccounts.map((account) => (
              <li key={account.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-brand-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{account.name}</p>
                    <p className="text-xs text-foreground-muted capitalize">{account.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="muted" size="sm">CLP</Badge>
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrency(account.balance, 'CLP')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
