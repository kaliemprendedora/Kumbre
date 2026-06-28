'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCLP } from '@/lib/format'

type Objetivo = { id: string; name: string; kind: string; target_amount: number; current_amount: number; target_date: string; monthly_contribution: number }

const kindLabels: Record<string, string> = {
  house: 'Casa', emergency: 'Emergencia', travel: 'Viaje',
  education: 'Educación', retirement: 'Jubilación', other: 'Otro',
}

export function ObjetivosClient({ initial }: { initial: Objetivo[] }) {
  const router = useRouter()
  const [objetivos, setObjetivos] = useState(initial)
  const [showing, setShowing] = useState(false)
  const [form, setForm] = useState({ name: '', kind: 'other', target_amount: '', current_amount: '', monthly_contribution: '', target_date: '' })
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const parse = (v: string) => Math.round(Number(v.replace(/\D/g, '')))
    const { data } = await supabase.from('objectives').insert({
      name: form.name, kind: form.kind,
      target_amount: parse(form.target_amount),
      current_amount: parse(form.current_amount),
      monthly_contribution: parse(form.monthly_contribution),
      target_date: form.target_date,
    }).select().single()
    if (data) { setObjetivos(p => [...p, data]); setShowing(false) }
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('objectives').delete().eq('id', id)
    setObjetivos(p => p.filter(o => o.id !== id))
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Objetivos</h2>
          <p className="text-sm text-foreground-muted">Tus metas financieras</p>
        </div>
        <Button size="sm" onClick={() => setShowing(true)}><Plus className="h-4 w-4 mr-1" />Agregar</Button>
      </div>

      {showing && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Nuevo objetivo</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Nombre</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Ej: Casa propia" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Categoría</label>
                  <select value={form.kind} onChange={e => setForm(p => ({ ...p, kind: e.target.value }))} className="input">
                    {Object.entries(kindLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Meta ($)</label>
                  <input value={form.target_amount} onChange={e => setForm(p => ({ ...p, target_amount: e.target.value }))} required placeholder="Ej: 50000000" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Ahorrado ($)</label>
                  <input value={form.current_amount} onChange={e => setForm(p => ({ ...p, current_amount: e.target.value }))} required placeholder="Ej: 5000000" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Aporte mensual ($)</label>
                  <input value={form.monthly_contribution} onChange={e => setForm(p => ({ ...p, monthly_contribution: e.target.value }))} required placeholder="Ej: 200000" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Fecha meta</label>
                  <input type="date" value={form.target_date} onChange={e => setForm(p => ({ ...p, target_date: e.target.value }))} required className="input" />
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

      {objetivos.length === 0 && !showing && (
        <Card><CardContent className="p-8 text-center text-sm text-foreground-muted">No tienes objetivos. Agrega tu primera meta financiera.</CardContent></Card>
      )}

      {objetivos.map(o => {
        const pct = Math.min(100, Math.round((o.current_amount / o.target_amount) * 100))
        return (
          <Card key={o.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{o.name}</p>
                  <p className="text-xs text-foreground-muted">{kindLabels[o.kind]} · {formatCLP(o.monthly_contribution)}/mes</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{pct}%</p>
                    <p className="text-xs text-foreground-muted">{formatCLP(o.current_amount)} / {formatCLP(o.target_amount)}</p>
                  </div>
                  <button onClick={() => handleDelete(o.id)} className="text-foreground-subtle hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
