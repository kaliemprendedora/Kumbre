'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCLP } from '@/lib/format'

type Cuenta = { id: string; name: string; kind: string; balance: number; is_liquid: boolean }

const kindLabels: Record<string, string> = {
  checking: 'Cuenta corriente', savings: 'Ahorro', investment: 'Inversión', other: 'Otro',
}

export function CuentasClient({ initial }: { initial: Cuenta[] }) {
  const router = useRouter()
  const [cuentas, setCuentas] = useState(initial)
  const [showing, setShowing] = useState(false)
  const [form, setForm] = useState({ name: '', kind: 'checking', balance: '', is_liquid: true })
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Cuenta>>({})

  function startEdit(c: Cuenta) {
    setEditing(c.id)
    setEditForm({ name: c.name, kind: c.kind, balance: c.balance, is_liquid: c.is_liquid })
  }

  async function handleEdit(id: string) {
    const supabase = createClient()
    await supabase.from('accounts').update({
      name: editForm.name, kind: editForm.kind,
      balance: editForm.balance, is_liquid: editForm.is_liquid,
    }).eq('id', id)
    setCuentas(p => p.map(c => c.id === id ? { ...c, ...editForm } as Cuenta : c))
    setEditing(null)
    router.refresh()
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('accounts').insert({
      name: form.name, kind: form.kind,
      balance: Math.round(Number(form.balance.replace(/\D/g, ''))),
      is_liquid: form.is_liquid,
    }).select().single()
    if (data) { setCuentas(p => [...p, data]); setShowing(false); setForm({ name: '', kind: 'checking', balance: '', is_liquid: true }) }
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('accounts').delete().eq('id', id)
    setCuentas(p => p.filter(c => c.id !== id))
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Cuentas</h2>
          <p className="text-sm text-foreground-muted">Tus cuentas bancarias, ahorros e inversiones</p>
        </div>
        <Button size="sm" onClick={() => setShowing(true)}><Plus className="h-4 w-4 mr-1" />Agregar</Button>
      </div>

      {showing && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Nueva cuenta</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Nombre</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Ej: BCI Corriente" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Tipo</label>
                  <select value={form.kind} onChange={e => setForm(p => ({ ...p, kind: e.target.value }))} className="input">
                    <option value="checking">Cuenta corriente</option>
                    <option value="savings">Ahorro</option>
                    <option value="investment">Inversión</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Saldo ($)</label>
                  <input value={form.balance} onChange={e => setForm(p => ({ ...p, balance: e.target.value }))} required placeholder="Ej: 1500000" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">¿Es líquida?</label>
                  <select value={form.is_liquid ? 'si' : 'no'} onChange={e => setForm(p => ({ ...p, is_liquid: e.target.value === 'si' }))} className="input">
                    <option value="si">Sí (disponible)</option>
                    <option value="no">No (bloqueada)</option>
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

      {cuentas.length === 0 && !showing && (
        <Card><CardContent className="p-8 text-center text-sm text-foreground-muted">No tienes cuentas. Agrega tu primera cuenta.</CardContent></Card>
      )}

      {cuentas.map(c => (
        <Card key={c.id}>
          <CardContent className="p-5">
            {editing === c.id ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Nombre</label>
                  <input value={editForm.name ?? ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Tipo</label>
                  <select value={editForm.kind ?? 'checking'} onChange={e => setEditForm(p => ({ ...p, kind: e.target.value }))} className="input">
                    <option value="checking">Cuenta corriente</option>
                    <option value="savings">Ahorro</option>
                    <option value="investment">Inversión</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Saldo ($)</label>
                  <input type="number" value={editForm.balance ?? 0} onChange={e => setEditForm(p => ({ ...p, balance: Number(e.target.value) }))} className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">¿Es líquida?</label>
                  <select value={editForm.is_liquid ? 'si' : 'no'} onChange={e => setEditForm(p => ({ ...p, is_liquid: e.target.value === 'si' }))} className="input">
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="col-span-2 flex gap-2 justify-end">
                  <button onClick={() => setEditing(null)} className="text-foreground-muted hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
                  <button onClick={() => handleEdit(c.id)} className="text-success hover:text-success/80 transition-colors"><Check className="h-4 w-4" /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-foreground-muted">{kindLabels[c.kind]} · {c.is_liquid ? 'Líquida' : 'No líquida'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-foreground">{formatCLP(c.balance)}</p>
                  <button onClick={() => startEdit(c)} className="text-foreground-subtle hover:text-foreground transition-colors"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(c.id)} className="text-foreground-subtle hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
