'use client'

import { useState } from 'react'
import {
  ShoppingBag, RefreshCw, TrendingUp, CreditCard, DollarSign, Plane,
  AlertTriangle, CheckCircle, XCircle, ChevronRight, Lightbulb,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { simulate } from '@/engine/engines/SimulationEngine'
import type { SimulationResult } from '@/engine/types/outputs'
import type { Decision, DecisionType } from '@/engine/types/inputs'
import type { FinancialSnapshot } from '@/engine/types/inputs'

const DECISION_TYPES: { type: DecisionType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'purchase', label: 'Compra', icon: <ShoppingBag className="h-4 w-4" />, description: 'Compra única o en cuotas' },
  { type: 'recurring_expense', label: 'Gasto recurrente', icon: <RefreshCw className="h-4 w-4" />, description: 'Suscripción o pago mensual nuevo' },
  { type: 'investment', label: 'Inversión', icon: <TrendingUp className="h-4 w-4" />, description: 'Invertir en fondo, APV u otro activo' },
  { type: 'credit', label: 'Crédito', icon: <CreditCard className="h-4 w-4" />, description: 'Solicitar un crédito o préstamo' },
  { type: 'income_change', label: 'Cambio de ingreso', icon: <DollarSign className="h-4 w-4" />, description: 'Aumento, reducción o nuevo ingreso' },
  { type: 'travel', label: 'Viaje', icon: <Plane className="h-4 w-4" />, description: 'Gasto único en viaje o vacaciones' },
]

const RISK_CONFIG = {
  low: { label: 'Bajo', variant: 'success' as const, icon: <CheckCircle className="h-4 w-4 text-success" /> },
  medium: { label: 'Medio', variant: 'warning' as const, icon: <AlertTriangle className="h-4 w-4 text-warning" /> },
  high: { label: 'Alto', variant: 'danger' as const, icon: <AlertTriangle className="h-4 w-4 text-danger" /> },
  critical: { label: 'Crítico', variant: 'danger' as const, icon: <XCircle className="h-4 w-4 text-danger" /> },
  none: { label: 'Ninguno', variant: 'success' as const, icon: <CheckCircle className="h-4 w-4 text-success" /> },
}

interface SimuladorClientProps {
  snapshot: FinancialSnapshot
}

export function SimuladorClient({ snapshot }: SimuladorClientProps) {
  const [selectedType, setSelectedType] = useState<DecisionType | null>(null)
  const [form, setForm] = useState({
    description: '',
    amount: '',
    installments: '',
    interestRate: '',
    monthlyAmount: '',
    durationMonths: '',
  })
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSimulate() {
    if (!selectedType || !form.amount) return
    setLoading(true)

    const decision: Decision = {
      type: selectedType,
      description: form.description || 'Decisión sin nombre',
      amount: Number(form.amount.replace(/\D/g, '')),
      startDate: snapshot.asOf,
      installments: form.installments ? Number(form.installments) : undefined,
      interestRate: form.interestRate ? Number(form.interestRate) / 100 : undefined,
      monthlyAmount: form.monthlyAmount ? Number(form.monthlyAmount.replace(/\D/g, '')) : undefined,
      durationMonths: form.durationMonths ? Number(form.durationMonths) : undefined,
    }

    // Run synchronously (engine is pure TS, no async)
    const res = simulate(snapshot, decision)
    setResult(res)
    setLoading(false)
  }

  function reset() {
    setResult(null)
    setSelectedType(null)
    setForm({ description: '', amount: '', installments: '', interestRate: '', monthlyAmount: '', durationMonths: '' })
  }

  if (result) {
    return <SimulationResults result={result} onReset={reset} />
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Step 1: type */}
      <Card>
        <CardHeader>
          <CardTitle>¿Qué tipo de decisión quieres evaluar?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {DECISION_TYPES.map((dt) => (
              <button
                key={dt.type}
                onClick={() => setSelectedType(dt.type)}
                className={`flex flex-col gap-2 rounded-[var(--radius-lg)] border p-4 text-left transition-all hover:border-brand-400 ${
                  selectedType === dt.type
                    ? 'border-brand-500 bg-brand-50 shadow-[var(--shadow-sm)]'
                    : 'border-border bg-surface-raised'
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] ${
                  selectedType === dt.type ? 'bg-brand-100 text-brand-700' : 'bg-border-subtle text-foreground-muted'
                }`}>
                  {dt.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{dt.label}</p>
                  <p className="text-xs text-foreground-muted mt-0.5 leading-snug">{dt.description}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: form */}
      {selectedType && (
        <Card>
          <CardHeader>
            <CardTitle>Describe la decisión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 max-w-md">
              <Input
                label="Descripción"
                placeholder="ej. Laptop para trabajo"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />

              <Input
                label={selectedType === 'income_change' ? 'Monto del cambio (+ aumento / - reducción)' : 'Monto total (CLP)'}
                placeholder="ej. 500000"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />

              {selectedType === 'purchase' && (
                <>
                  <Input
                    label="Cuotas (vacío = pago contado)"
                    placeholder="ej. 12"
                    value={form.installments}
                    onChange={(e) => setForm((f) => ({ ...f, installments: e.target.value }))}
                  />
                  {form.installments && (
                    <Input
                      label="Tasa de interés anual % (0 = sin interés)"
                      placeholder="ej. 24"
                      value={form.interestRate}
                      onChange={(e) => setForm((f) => ({ ...f, interestRate: e.target.value }))}
                    />
                  )}
                </>
              )}

              {(selectedType === 'recurring_expense' || selectedType === 'hire') && (
                <>
                  <Input
                    label="Monto mensual (CLP)"
                    placeholder="ej. 50000"
                    value={form.monthlyAmount}
                    onChange={(e) => setForm((f) => ({ ...f, monthlyAmount: e.target.value }))}
                  />
                  <Input
                    label="Duración en meses"
                    placeholder="ej. 12"
                    value={form.durationMonths}
                    onChange={(e) => setForm((f) => ({ ...f, durationMonths: e.target.value }))}
                  />
                </>
              )}

              {selectedType === 'credit' && (
                <>
                  <Input
                    label="Plazo en meses"
                    placeholder="ej. 24"
                    value={form.durationMonths}
                    onChange={(e) => setForm((f) => ({ ...f, durationMonths: e.target.value }))}
                  />
                  <Input
                    label="Tasa de interés anual %"
                    placeholder="ej. 15"
                    value={form.interestRate}
                    onChange={(e) => setForm((f) => ({ ...f, interestRate: e.target.value }))}
                  />
                </>
              )}

              {selectedType === 'income_change' && (
                <Input
                  label="Duración en meses (vacío = permanente)"
                  placeholder="ej. 6"
                  value={form.durationMonths}
                  onChange={(e) => setForm((f) => ({ ...f, durationMonths: e.target.value }))}
                />
              )}

              <Button
                variant="primary"
                onClick={handleSimulate}
                disabled={!form.amount || loading}
                className="self-start mt-2"
              >
                {loading ? 'Calculando...' : 'Simular'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SimulationResults({ result, onReset }: { result: SimulationResult; onReset: () => void }) {
  const risk = RISK_CONFIG[result.riskLevel] ?? RISK_CONFIG.low
  const cashDelta = result.impactOnCashFlow.monthlyDelta
  const savingsRateDelta = Math.round(result.impactOnCashFlow.savingsRateDelta * 100)

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      {/* Header */}
      <div className={`rounded-[var(--radius-xl)] p-5 border ${
        result.feasible
          ? 'bg-surface-raised border-border'
          : 'bg-danger-bg border-danger/30'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {result.feasible
                ? <CheckCircle className="h-5 w-5 text-success" />
                : <XCircle className="h-5 w-5 text-danger" />}
              <span className="text-sm font-semibold text-foreground">
                {result.feasible ? 'Decisión factible' : 'Decisión no recomendada'}
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">{result.decision.description}</p>
            {result.feasibilityReason && (
              <p className="text-xs text-danger mt-1">{result.feasibilityReason}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge variant={risk.variant} size="sm">
              Riesgo {risk.label}
            </Badge>
            <p className="text-xs text-foreground-muted">
              Costo total: {formatCurrency(result.totalCost, 'CLP')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Cashflow impact */}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">Impacto en flujo de caja</p>
            <ImpactRow
              label="Cambio mensual"
              value={formatCurrency(Math.abs(cashDelta), 'CLP')}
              sign={cashDelta >= 0 ? '+' : '-'}
              negative={cashDelta < 0}
            />
            <ImpactRow
              label="Cambio anual"
              value={formatCurrency(Math.abs(result.impactOnCashFlow.annualDelta), 'CLP')}
              sign={result.impactOnCashFlow.annualDelta >= 0 ? '+' : '-'}
              negative={result.impactOnCashFlow.annualDelta < 0}
            />
            <ImpactRow
              label="Nueva tasa de ahorro"
              value={formatPercent(Math.round(result.impactOnCashFlow.newSavingsRate * 100), 0)}
              sign={savingsRateDelta >= 0 ? '+' : ''}
              sub={`${savingsRateDelta > 0 ? '+' : ''}${savingsRateDelta}pp`}
              negative={savingsRateDelta < 0}
            />
            {result.monthlyCost > 0 && (
              <ImpactRow
                label="Cuota mensual"
                value={formatCurrency(result.monthlyCost, 'CLP')}
                sign="-"
                negative
              />
            )}
          </CardContent>
        </Card>

        {/* Net worth impact */}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">Impacto en patrimonio</p>
            <ImpactRow
              label="Impacto inmediato"
              value={formatCurrency(Math.abs(result.impactOnNetWorth.immediateImpact), 'CLP')}
              sign={result.impactOnNetWorth.immediateImpact >= 0 ? '+' : '-'}
              negative={result.impactOnNetWorth.immediateImpact < 0}
            />
            <ImpactRow
              label="Impacto a 12 meses"
              value={formatCurrency(Math.abs(result.impactOnNetWorth.impactAt12Months), 'CLP')}
              sign={result.impactOnNetWorth.impactAt12Months >= 0 ? '+' : '-'}
              negative={result.impactOnNetWorth.impactAt12Months < 0}
            />
            <ImpactRow
              label="Costo oportunidad"
              value={formatCurrency(result.impactOnSavings.opportunityCost, 'CLP')}
              sign="-"
              negative
              sub="7% anual estimado"
            />
            {result.impactOnNetWorth.isAsset && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-success">
                <TrendingUp className="h-3 w-3" />
                Genera un activo en el patrimonio
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debt impact */}
        {result.impactOnDebt && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">Impacto en deuda</p>
              <ImpactRow
                label="Nueva deuda total"
                value={formatCurrency(result.impactOnDebt.newDebtTotal, 'CLP')}
                sign=""
                negative={false}
              />
              <ImpactRow
                label="Nueva cuota mensual"
                value={formatCurrency(result.impactOnDebt.additionalMonthlyPayment, 'CLP')}
                sign="+"
                negative
              />
              <ImpactRow
                label="Intereses totales"
                value={formatCurrency(result.impactOnDebt.totalInterestCost, 'CLP')}
                sign="-"
                negative
              />
              <ImpactRow
                label="Nuevo DTI"
                value={formatPercent(result.impactOnDebt.newDebtToIncomeRatio * 100, 1)}
                sign=""
                negative={result.impactOnDebt.newDebtToIncomeRatio > 0.35}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Goal delays */}
      {result.delayInGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Impacto en objetivos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-2">
            <ul className="divide-y divide-border">
              {result.delayInGoals.map((g) => (
                <li key={g.goalId} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm text-foreground">{g.goalName}</span>
                  <Badge variant="warning" size="sm">+{g.delayMonths} {g.delayMonths === 1 ? 'mes' : 'meses'} de retraso</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Goals with no delay */}
      {result.delayInGoals.length === 0 && result.impactOnGoals.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-success rounded-[var(--radius-lg)] bg-success-bg px-4 py-3">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Esta decisión no retrasa ninguno de tus objetivos financieros.
        </div>
      )}

      {/* Alternatives */}
      {result.alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" />
              Alternativas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-2">
            <ul className="divide-y divide-border">
              {result.alternatives.map((alt, i) => (
                <li key={i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{alt.description}</p>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {formatCurrency(alt.monthlyCost, 'CLP')}/mes · total {formatCurrency(alt.totalCost, 'CLP')}
                    </p>
                  </div>
                  <Badge variant={alt.riskLevel === 'low' ? 'success' : 'warning'} size="sm">
                    Riesgo {alt.riskLevel === 'low' ? 'bajo' : 'medio'}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Savings impact bar */}
      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-3">
            Ahorro mensual — antes vs después
          </p>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground-muted">Ahorro actual</span>
                <span className="font-medium">{formatCurrency(result.impactOnSavings.monthlySavingsDelta > 0 ? result.impactOnCashFlow.newMonthlyCashflow - result.impactOnSavings.monthlySavingsDelta : result.impactOnCashFlow.newMonthlyCashflow + Math.abs(result.impactOnSavings.monthlySavingsDelta), 'CLP')}</span>
              </div>
              <Progress value={Math.min(100, Math.round(result.impactOnCashFlow.newSavingsRate * 100 + (result.impactOnSavings.monthlySavingsDelta > 0 ? -result.impactOnCashFlow.savingsRateDelta * 100 : result.impactOnCashFlow.savingsRateDelta * -100)))} color="brand" size="sm" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground-muted">Ahorro después de la decisión</span>
                <span className={`font-medium ${result.impactOnCashFlow.newMonthlyCashflow < 0 ? 'text-danger' : 'text-foreground'}`}>
                  {formatCurrency(result.impactOnCashFlow.newMonthlyCashflow, 'CLP')}
                </span>
              </div>
              <Progress value={Math.max(0, Math.min(100, Math.round(result.impactOnCashFlow.newSavingsRate * 100)))} color={result.impactOnCashFlow.newSavingsRate < 0.10 ? 'danger' : result.impactOnCashFlow.newSavingsRate < 0.20 ? 'warning' : 'success'} size="sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="secondary" onClick={onReset} className="self-start">
        ← Nueva simulación
      </Button>
    </div>
  )
}

function ImpactRow({
  label,
  value,
  sign,
  sub,
  negative,
}: {
  label: string
  value: string
  sign: string
  sub?: string
  negative: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1.5 text-xs border-b border-border last:border-0">
      <span className="text-foreground-muted">{label}</span>
      <div className="text-right">
        <span className={`font-semibold ${negative ? 'text-danger' : sign === '+' ? 'text-success' : 'text-foreground'}`}>
          {sign}{value}
        </span>
        {sub && <p className="text-[10px] text-foreground-subtle">{sub}</p>}
      </div>
    </div>
  )
}
