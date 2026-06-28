'use client'

import { useState, useMemo } from 'react'
import { ArrowDownLeft, ArrowUpRight, Search, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Tx = { id: string; description: string; amount: number; kind: string; is_recurring: boolean; account_id: string; date: string }
type Cuenta = { id: string; name: string }

export function MovimientosClient({ initial, cuentas }: { initial: Tx[]; cuentas: Cuenta[] }) {
  const router = useRouter()
  const [txs, setTxs] = useState(initial)
  const [search, setSearch] = useState('')
  const [filterKind, setFilterKind] = useState<'all' | 'income' | 'expense'>('all')
  const [showing, setShowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ description: '', amount: '', kind: 'income', is_recurring: false, account_id: cuentas[0]?.id ?? '', date: new Date().toISOString().split('T')[0] })

  const accountMap = useMemo(() => new Map(cuentas.map(c => [c.id, c.name])), [cuentas])

  const filtered = useMemo(() =>
    txs
      .filter(t => filterKind === 'all' || t.kind === filterKind)
      .filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [txs, search, filterKind]
  )

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.account_id) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('transactions').insert({
      description: form.description,
      amount: Math.round(Number(form.amount.replace(/\D/g, ''))),
      kind: form.kind,
      is_recurring: form.is_recurring,
      account_id: form.account_id,
      date: form.date,
    }).select().single()
    if (data) {
      setTxs(p => [data, ...p])
      setShowing(false)
      setForm({ description: '', amount: '', kind: 'income', is_recurring: false, account_id: cuentas[0]?.id ?? '', date: new Date().toISOString().split('T')[0] })
    }
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('transactions').delete().eq('id', id)
    setTxs(p => p.filter(t => t.id !== id))
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar movimientos..."
              className="input pl-9 w-full"
            />
          </div>
          <select value={filterKind} onChange={e => setFilterKind(e.target.value as typeof filterKind)} className="input w-auto">
            <option value="all">Todos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowing(true)} disabled={cuentas.length === 0}>
          <Plus className="h-3.5 w-3.5" />
          Movimiento
        </Button>
      </div>

      {cuentas.length === 0 && (
        <div className="rounded-[var(--radius-lg)] bg-warning-bg border border-warning/30 p-4 text-sm text-foreground-muted">
          Primero agrega una cuenta en <a href="/perfil/cuentas" className="underline font-medium text-foreground">Mi Perfil → Cuentas</a>.
        </div>
      )}

      {showing && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Nuevo movimiento</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-medium text-foreground-muted">Descripción</label>
                  <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required placeholder="Ej: Sueldo, Supermercado" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Monto ($)</label>
                  <input value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required placeholder="Ej: 500000" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Tipo</label>
                  <select value={form.kind} onChange={e => setForm(p => ({ ...p, kind: e.target.value }))} className="input">
                    <option value="income">Ingreso</option>
                    <option value="expense">Gasto</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Cuenta</label>
                  <select value={form.account_id} onChange={e => setForm(p => ({ ...p, account_id: e.target.value }))} className="input">
                    {cuentas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Fecha</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">¿Es mensual?</label>
                  <select value={form.is_recurring ? 'si' : 'no'} onChange={e => setForm(p => ({ ...p, is_recurring: e.target.value === 'si' }))} className="input">
                    <option value="no">No (único)</option>
                    <option value="si">Sí (mensual)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowing(false)}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-foreground-muted py-12">
              {search ? 'Sin resultados para tu búsqueda.' : 'No tienes movimientos registrados.'}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((tx) => {
                const isIncome = tx.kind === 'income'
                return (
                  <li key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-border-subtle transition-colors group">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isIncome ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                      {isIncome ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-1 min-w-0 flex-col gap-1">
                      <span className="text-sm font-medium text-foreground">{tx.description}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-foreground-muted">{formatDate(tx.date)}</span>
                        {accountMap.get(tx.account_id) && (
                          <>
                            <span className="text-foreground-subtle text-xs">·</span>
                            <span className="text-xs text-foreground-muted">{accountMap.get(tx.account_id)}</span>
                          </>
                        )}
                        {tx.is_recurring && <span className="text-[10px] text-brand-500 font-medium bg-brand-50 px-1.5 py-0.5 rounded-full">Mensual</span>}
                      </div>
                    </div>
                    <span className={`text-sm font-semibold shrink-0 ${isIncome ? 'text-success' : 'text-foreground'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(Math.abs(tx.amount), 'CLP')}
                    </span>
                    <button onClick={() => handleDelete(tx.id)} className="opacity-0 group-hover:opacity-100 text-foreground-subtle hover:text-danger transition-all ml-1">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
