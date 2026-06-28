'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCLP } from '@/lib/format'

type Deuda = { id: string; name: string; kind: string; remaining_amount: number; monthly_payment: number; interest_rate: number }

const kindLabels: Record<string, string> = {
  mortgage: 'Hipoteca', personal: 'Crédito personal', auto: 'Auto',
  credit_card: 'Tarjeta de crédito', student: 'Educación', other: 'Otro',
}

export function DeudasClient({ initial }: { initial: Deuda[] }) {
  const router = useRouter()
  const [deudas, setDeudas] = useState(initial)
  const [showing, setShowing] = useState(false)
  const [form, setForm] = useState({ name: '', kind: 'personal', original_amount: '', remaining_amount: '', monthly_payment: '', interest_rate: '', start_date: '', end_date: '' })
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Deuda & { interest_rate_pct: string }>>({})

  async function handleEdit(id: string) {
    const supabase = createClient()
    await supabase.from('debts').update({
      name: editForm.name,
      kind: editForm.kind,
      remaining_amount: editForm.remaining_amount,
      monthly_payment: editForm.monthly_payment,
      interest_rate: Number(editForm.interest_rate_pct) / 100,
    }).eq('id', id)
    setDeudas(p => p.map(d => d.id === id ? { ...d, ...editForm, interest_rate: Number(editForm.interest_rate_pct) / 100 } as Deuda : d))
    setEditing(null)
    router.refresh()
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const parse = (v: string) => Math.round(Number(v.replace(/\D/g, '')))
    const { data } = await supabase.from('debts').insert({
      name: form.name, kind: form.kind,
      original_amount: parse(form.original_amount),
      remaining_amount: parse(form.remaining_amount),
      monthly_payment: parse(form.monthly_payment),
      interest_rate: Number(form.interest_rate) / 100,
      start_date: form.start_date,
      end_date: form.end_date,
    }).select().single()
    if (data) { setDeudas(p => [...p, data]); setShowing(false) }
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('debts').delete().eq('id', id)
    setDeudas(p => p.filter(d => d.id !== id))
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Deudas</h2>
          <p className="text-sm text-foreground-muted">Créditos, hipotecas y tarjetas</p>
        </div>
        <Button size="sm" onClick={() => setShowing(true)}><Plus className="h-4 w-4 mr-1" />Agregar</Button>
      </div>

      {showing && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Nueva deuda</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Nombre</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Ej: Crédito BCI" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Tipo</label>
                  <select value={form.kind} onChange={e => setForm(p => ({ ...p, kind: e.target.value }))} className="input">
                    {Object.entries(kindLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Monto original ($)</label>
                  <input value={form.original_amount} onChange={e => setForm(p => ({ ...p, original_amount: e.target.value }))} required placeholder="Ej: 5000000" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Saldo pendiente ($)</label>
                  <input value={form.remaining_amount} onChange={e => setForm(p => ({ ...p, remaining_amount: e.target.value }))} required placeholder="Ej: 3000000" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Cuota mensual ($)</label>
                  <input value={form.monthly_payment} onChange={e => setForm(p => ({ ...p, monthly_payment: e.target.value }))} required placeholder="Ej: 180000" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Tasa anual (%)</label>
                  <input value={form.interest_rate} onChange={e => setForm(p => ({ ...p, interest_rate: e.target.value }))} required placeholder="Ej: 12" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Fecha inicio</label>
                  <input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} required className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Fecha término</label>
                  <input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} required className="input" />
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

      {deudas.length === 0 && !showing && (
        <Card><CardContent className="p-8 text-center text-sm text-foreground-muted">No tienes deudas registradas.</CardContent></Card>
      )}

      {deudas.map(d => (
        <Card key={d.id}>
          <CardContent className="p-5">
            {editing === d.id ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Nombre</label>
                  <input value={editForm.name ?? ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Tipo</label>
                  <select value={editForm.kind ?? 'personal'} onChange={e => setEditForm(p => ({ ...p, kind: e.target.value }))} className="input">
                    {Object.entries(kindLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Saldo pendiente ($)</label>
                  <input type="number" value={editForm.remaining_amount ?? 0} onChange={e => setEditForm(p => ({ ...p, remaining_amount: Number(e.target.value) }))} className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Cuota mensual ($)</label>
                  <input type="number" value={editForm.monthly_payment ?? 0} onChange={e => setEditForm(p => ({ ...p, monthly_payment: Number(e.target.value) }))} className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Tasa anual (%)</label>
                  <input type="number" value={editForm.interest_rate_pct ?? ''} onChange={e => setEditForm(p => ({ ...p, interest_rate_pct: e.target.value }))} className="input" />
                </div>
                <div className="flex items-end gap-2 justify-end">
                  <button onClick={() => setEditing(null)} className="text-foreground-muted hover:text-foreground"><X className="h-4 w-4" /></button>
                  <button onClick={() => handleEdit(d.id)} className="text-success hover:text-success/80"><Check className="h-4 w-4" /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{d.name}</p>
                  <p className="text-xs text-foreground-muted">{kindLabels[d.kind]} · {d.interest_rate * 100}% anual</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{formatCLP(d.remaining_amount)}</p>
                    <p className="text-xs text-foreground-muted">{formatCLP(d.monthly_payment)}/mes</p>
                  </div>
                  <button onClick={() => { setEditing(d.id); setEditForm({ ...d, interest_rate_pct: String(d.interest_rate * 100) }) }} className="text-foreground-subtle hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(d.id)} className="text-foreground-subtle hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
