import type { Metadata } from 'next'
import { TrendingUp, TrendingDown, Droplets, Lock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { getAnalysisForUser } from '@/lib/kumbre'

export const metadata: Metadata = { title: 'Patrimonio' }

export default async function PatrimonioPage() {
  const { netWorth, debt, cashflow } = await getAnalysisForUser()

  const debtToAsset = Math.round(netWorth.debtToAssetRatio * 100)

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-foreground-muted mb-2">Activos totales</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(netWorth.totalAssets, 'CLP')}</p>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Líquidos: {formatCurrency(netWorth.liquidAssets, 'CLP')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-foreground-muted mb-2">Pasivos totales</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(netWorth.totalLiabilities, 'CLP')}</p>
            {debt.highestInterestDebt && (
              <p className="text-xs text-foreground-muted mt-1">Mayor tasa: {debt.highestInterestDebt}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-foreground-muted mb-2">Patrimonio neto</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(netWorth.netWorth, 'CLP')}</p>
              </div>
              <Badge variant={netWorth.netWorth > 0 ? 'success' : 'danger'} size="sm">
                {netWorth.netWorth > 0 ? 'Positivo' : 'Negativo'}
              </Badge>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground-muted">Ratio deuda/activo</span>
                <span className="font-medium">{formatPercent(debtToAsset, 0)}</span>
              </div>
              <Progress value={debtToAsset} color={debtToAsset > 50 ? 'danger' : debtToAsset > 30 ? 'warning' : 'success'} size="sm" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Assets breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Activos</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-2">
            <ul className="divide-y divide-border">
              {netWorth.assetBreakdown.cash > 0 && (
                <AssetRow
                  label="Cuentas corrientes / Efectivo"
                  amount={netWorth.assetBreakdown.cash}
                  total={netWorth.totalAssets}
                  liquid
                  icon="💵"
                />
              )}
              {netWorth.assetBreakdown.savings > 0 && (
                <AssetRow
                  label="Cuentas de ahorro"
                  amount={netWorth.assetBreakdown.savings}
                  total={netWorth.totalAssets}
                  liquid
                  icon="🏦"
                />
              )}
              {netWorth.assetBreakdown.investments > 0 && (
                <AssetRow
                  label="Inversiones y APV"
                  amount={netWorth.assetBreakdown.investments}
                  total={netWorth.totalAssets}
                  liquid={false}
                  icon="📈"
                />
              )}
              {netWorth.assetBreakdown.realEstate > 0 && (
                <AssetRow
                  label="Bienes raíces"
                  amount={netWorth.assetBreakdown.realEstate}
                  total={netWorth.totalAssets}
                  liquid={false}
                  icon="🏠"
                />
              )}
            </ul>

            <div className="px-5 py-3 flex items-center gap-4 text-xs text-foreground-muted">
              <div className="flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-brand-500" />
                Líquido: {formatCurrency(netWorth.liquidAssets, 'CLP')}
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-foreground-subtle" />
                No líquido: {formatCurrency(netWorth.illiquidAssets, 'CLP')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liabilities breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Pasivos</CardTitle>
          </CardHeader>
          {netWorth.totalLiabilities === 0 ? (
            <CardContent>
              <p className="text-sm text-foreground-muted text-center py-8">Sin deudas registradas 🎉</p>
            </CardContent>
          ) : (
            <CardContent className="p-0 pb-2">
              <ul className="divide-y divide-border">
                {debt.debts.map((d) => (
                  <li key={d.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{d.name}</p>
                      <p className="text-xs text-foreground-muted mt-0.5">
                        {formatCurrency(d.monthlyPayment, 'CLP')}/mes · {d.remainingMonths} meses restantes · {formatPercent(d.interestRate * 100, 0)} anual
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{formatCurrency(d.remainingAmount, 'CLP')}</p>
                      <p className="text-xs text-foreground-muted">pendiente</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Emergency fund coverage */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Fondo de emergencia</p>
              <p className="text-xs text-foreground-muted mt-0.5">Cobertura con activos líquidos actuales</p>
            </div>
            <Badge
              variant={netWorth.liquidAssets / (netWorth.totalAssets / 10) >= 3 ? 'success' : 'warning'}
              size="sm"
            >
              {formatCurrency(netWorth.liquidAssets, 'CLP')} disponibles
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            {[1, 3, 6].map((months) => {
              const monthlyExpense = cashflow.expenses || 1_175_000
              const needed = monthlyExpense * months
              const covered = netWorth.liquidAssets >= needed
              return (
                <div key={months} className={`rounded-[var(--radius-lg)] p-3 ${covered ? 'bg-success-bg' : 'bg-danger-bg'}`}>
                  <p className="text-2xl font-bold mb-1">{covered ? '✓' : '✗'}</p>
                  <p className="text-xs font-semibold text-foreground">{months} {months === 1 ? 'mes' : 'meses'}</p>
                  <p className="text-[10px] text-foreground-muted">{formatCurrency(needed, 'CLP')}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AssetRow({
  label,
  amount,
  total,
  liquid,
  icon,
}: {
  label: string
  amount: number
  total: number
  liquid: boolean
  icon: string
}) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0
  return (
    <li className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-foreground-muted">{pct}% del total</span>
            <Badge variant={liquid ? 'success' : 'muted'} size="sm">
              {liquid ? 'Líquido' : 'No líquido'}
            </Badge>
          </div>
        </div>
      </div>
      <span className="text-sm font-semibold text-foreground">{formatCurrency(amount, 'CLP')}</span>
    </li>
  )
}
