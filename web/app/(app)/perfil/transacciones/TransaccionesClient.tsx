'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCLP } from '@/lib/format'

type Tx = { id: string; description: string; amount: number; kind: string; is_recurring: boolean; account_id: string; is_business: boolean }
type Cuenta = { id: string; name: string; is_business: boolean }

export function TransaccionesClient({ initial, cuentas }: { initial: Tx[]; cuentas: Cuenta[] }) {
  const router = useRouter()
  const [txs, setTxs] = useState(initial)
  const [tab, setTab] = useState<'personal' | 'negocio'>('personal')
  const [showing, setShowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Tx>>({})

  const isBusiness = tab === 'negocio'
  const tabCuentas = cuentas.filter(c => c.is_business === isBusiness)
  const tabTxs = txs.filter(t => t.is_business === isBusiness)

  const [form, setForm] = useState({ description: '', amount: '', kind: 'income', is_recurring: true, account_id: cuentas.find(c => !c.is_business)?.id ?? '' })

  const ingresos = tabTxs.filter(t => t.kind === 'income')
  const gastos = tabTxs.filter(t => t.kind === 'expense')

  async function handleEdit(id: string) {
    const supabase = createClient()
    await supabase.from('transactions').update({
      description: editForm.description,
      amount: editForm.amount,
      kind: editForm.kind,
      is_recurring: editForm.is_recurring,
      account_id: editForm.account_id,
    }).eq('id', id)
    setTxs(p => p.map(t => t.id === id ? { ...t, ...editForm } as Tx : t))
    setEditing(null)
    router.refresh()
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.account_id) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('transactions').insert({
      user_id: user!.id,
      description: form.description,
      amount: Math.round(Number(form.amount.replace(/\D/g, ''))),
      kind: form.kind,
      is_recurring: form.is_recurring,
      account_id: form.account_id,
      is_business: isBusiness,
      date: new Date().toISOString().split('T')[0],
    }).select().single()
    if (data) { setTxs(p => [...p, data]); setShowing(false) }
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
    <div className="flex flex-col gap-6 animate-slide-up max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Ingresos y Gastos</h2>
          <p className="text-sm text-foreground-muted">Tus entradas y salidas de dinero mensuales</p>
        </div>
        <Button size="sm" onClick={() => setShowing(true)} disabled={tabCuentas.length === 0}>
          <Plus className="h-4 w-4 mr-1" />Agregar
        </Button>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 p-1 bg-border-subtle rounded-[var(--radius-md)] w-fit">
        {(['personal', 'negocio'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setShowing(false) }}
            className={`px-4 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-colors ${tab === t ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'}`}
          >
            {t === 'personal' ? '👤 Personal' : '🏢 Negocio'}
          </button>
        ))}
      </div>

      {tabCuentas.length === 0 && (
        <Card><CardContent className="p-5 text-sm text-foreground-muted">
          {isBusiness
            ? <>Primero debes agregar una cuenta de <strong>negocio</strong> en <strong>Cuentas</strong>.</>
            : <>Primero debes agregar al menos una cuenta en <strong>Cuentas</strong>.</>}
        </CardContent></Card>
      )}

      {showing && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Nuevo ingreso o gasto {isBusiness ? '· Negocio' : '· Personal'}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-medium text-foreground-muted">Descripción</label>
                  <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required placeholder="Ej: Sueldo, Arriendo" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Monto ($)</label>
                  <input value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required placeholder="Ej: 1500000" className="input" />
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
                    {tabCuentas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">¿Es mensual?</label>
                  <select value={form.is_recurring ? 'si' : 'no'} onChange={e => setForm(p => ({ ...p, is_recurring: e.target.value === 'si' }))} className="input">
                    <option value="si">Sí (mensual)</option>
                    <option value="no">No (único)</option>
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

      {[{ label: 'Ingresos', items: ingresos, color: 'text-green-600' }, { label: 'Gastos', items: gastos, color: 'text-red-500' }].map(({ label, items, color }) => (
        <div key={label}>
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-2">{label}</p>
          {items.length === 0
            ? <Card><CardContent className="p-4 text-sm text-foreground-muted">Sin {label.toLowerCase()} registrados.</CardContent></Card>
            : items.map(t => (
              <Card key={t.id} className="mb-2">
                <CardContent className="p-4">
                  {editing === t.id ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5 col-span-2">
                        <label className="text-xs font-medium text-foreground-muted">Descripción</label>
                        <input value={editForm.description ?? ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} className="input" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-foreground-muted">Monto ($)</label>
                        <input type="number" value={editForm.amount ?? 0} onChange={e => setEditForm(p => ({ ...p, amount: Number(e.target.value) }))} className="input" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-foreground-muted">Tipo</label>
                        <select value={editForm.kind ?? 'income'} onChange={e => setEditForm(p => ({ ...p, kind: e.target.value }))} className="input">
                          <option value="income">Ingreso</option>
                          <option value="expense">Gasto</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-foreground-muted">Cuenta</label>
                        <select value={editForm.account_id ?? ''} onChange={e => setEditForm(p => ({ ...p, account_id: e.target.value }))} className="input">
                          {tabCuentas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-foreground-muted">¿Mensual?</label>
                        <select value={editForm.is_recurring ? 'si' : 'no'} onChange={e => setEditForm(p => ({ ...p, is_recurring: e.target.value === 'si' }))} className="input">
                          <option value="si">Sí</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div className="col-span-2 flex gap-2 justify-end">
                        <button onClick={() => setEditing(null)} className="text-foreground-muted hover:text-foreground"><X className="h-4 w-4" /></button>
                        <button onClick={() => handleEdit(t.id)} className="text-success hover:text-success/80"><Check className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.description}</p>
                        <p className="text-xs text-foreground-muted">{t.is_recurring ? 'Mensual' : 'Único'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className={`text-sm font-semibold ${color}`}>{formatCLP(t.amount)}</p>
                        <button onClick={() => { setEditing(t.id); setEditForm(t) }} className="text-foreground-subtle hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDelete(t.id)} className="text-foreground-subtle hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          }
        </div>
      ))}
    </div>
  )
}
