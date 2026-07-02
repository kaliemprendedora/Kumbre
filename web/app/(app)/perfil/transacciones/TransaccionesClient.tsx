'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Pencil, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCLP } from '@/lib/format'

type Tx = {
  id: string; description: string; amount: number; kind: string
  is_recurring: boolean; account_id: string; is_business: boolean
  category_id?: string; subcategory_id?: string; date?: string
}
type Cuenta = { id: string; name: string; is_business: boolean }
type Category = { id: string; name: string; kind: string; parent_id: string | null; description: string | null }

function localToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function displayDate(s?: string) {
  if (!s) return ''
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function TransaccionesClient({ initial, cuentas, initialCategories }: {
  initial: Tx[]; cuentas: Cuenta[]; initialCategories: Category[]
}) {
  const router = useRouter()
  const [txs, setTxs] = useState(initial)
  const [categories, setCategories] = useState(initialCategories)
  const [tab, setTab] = useState<'personal' | 'negocio'>('personal')
  const [showing, setShowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Tx>>({})
  const [newCatForm, setNewCatForm] = useState<{ name: string; description: string; parentId: string } | null>(null)
  const [newCatLoading, setNewCatLoading] = useState(false)

  const isBusiness = tab === 'negocio'
  const tabCuentas = cuentas.filter(c => c.is_business === isBusiness)
  const tabTxs = txs.filter(t => t.is_business === isBusiness)

  const [form, setForm] = useState({
    description: '', amount: '', kind: 'income', is_recurring: true,
    account_id: cuentas.find(c => !c.is_business)?.id ?? '',
    category_id: '', subcategory_id: '', date: localToday(),
  })

  const rootCategories = useMemo(() => categories.filter(c => !c.parent_id), [categories])
  const subCategories = useMemo(() =>
    categories.filter(c => c.parent_id === form.category_id),
    [categories, form.category_id]
  )
  const editSubCategories = useMemo(() =>
    categories.filter(c => c.parent_id === editForm.category_id),
    [categories, editForm.category_id]
  )

  const ingresos = tabTxs.filter(t => t.kind === 'income')
  const gastos = tabTxs.filter(t => t.kind === 'expense')

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
      date: form.date,
      category_id: form.category_id || null,
      subcategory_id: form.subcategory_id || null,
    }).select().single()
    if (data) {
      setTxs(p => [data, ...p])
      setShowing(false)
      setForm(p => ({ ...p, description: '', amount: '', category_id: '', subcategory_id: '', date: localToday() }))
    }
    setLoading(false)
    router.refresh()
  }

  async function handleEdit(id: string) {
    const supabase = createClient()
    await supabase.from('transactions').update({
      description: editForm.description,
      amount: editForm.amount,
      kind: editForm.kind,
      is_recurring: editForm.is_recurring,
      account_id: editForm.account_id,
      date: editForm.date,
      category_id: editForm.category_id || null,
      subcategory_id: editForm.subcategory_id || null,
    }).eq('id', id)
    setTxs(p => p.map(t => t.id === id ? { ...t, ...editForm } as Tx : t))
    setEditing(null)
    router.refresh()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('transactions').delete().eq('id', id)
    setTxs(p => p.filter(t => t.id !== id))
    router.refresh()
  }

  async function handleNewCategory(forForm: 'add' | 'edit') {
    if (!newCatForm || !newCatForm.name.trim()) return
    setNewCatLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const kind = forForm === 'add' ? form.kind : (editForm.kind ?? 'expense')
    const { data } = await supabase.from('categories').insert({
      user_id: user!.id,
      name: newCatForm.name.trim(),
      kind,
      parent_id: newCatForm.parentId || null,
      description: newCatForm.description || null,
    }).select().single()
    if (data) {
      setCategories(p => [...p, data])
      if (newCatForm.parentId) {
        if (forForm === 'add') setForm(p => ({ ...p, subcategory_id: data.id }))
        else setEditForm(p => ({ ...p, subcategory_id: data.id }))
      } else {
        if (forForm === 'add') setForm(p => ({ ...p, category_id: data.id, subcategory_id: '' }))
        else setEditForm(p => ({ ...p, category_id: data.id, subcategory_id: '' }))
      }
      setNewCatForm(null)
    }
    setNewCatLoading(false)
  }

  function getCatName(id?: string) {
    if (!id) return null
    return categories.find(c => c.id === id)?.name ?? null
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Ingresos y Gastos</h2>
          <p className="text-sm text-foreground-muted">Tus entradas y salidas de dinero</p>
        </div>
        <Button size="sm" onClick={() => setShowing(true)} disabled={tabCuentas.length === 0}>
          <Plus className="h-4 w-4 mr-1" />Agregar
        </Button>
      </div>

      <div className="flex gap-1 p-1 bg-border-subtle rounded-[var(--radius-md)] w-fit">
        {(['personal', 'negocio'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setShowing(false) }}
            className={`px-4 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-colors ${tab === t ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'}`}>
            {t === 'personal' ? '👤 Personal' : '🏢 Negocio'}
          </button>
        ))}
      </div>

      {tabCuentas.length === 0 && (
        <Card><CardContent className="p-5 text-sm text-foreground-muted">
          {isBusiness ? <>Agrega una cuenta de <strong>negocio</strong> primero.</> : <>Agrega al menos una cuenta primero.</>}
        </CardContent></Card>
      )}

      {showing && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Nuevo movimiento {isBusiness ? '· Negocio' : '· Personal'}</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-medium text-foreground-muted">Descripción</label>
                  <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required placeholder="Ej: Sueldo, Arriendo" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Monto ($)</label>
                  <input value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required placeholder="Ej: 1.500.000" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Fecha</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Tipo</label>
                  <select value={form.kind} onChange={e => setForm(p => ({ ...p, kind: e.target.value, category_id: '', subcategory_id: '' }))} className="input">
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

                {/* Categoría */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-medium text-foreground-muted">Categoría</label>
                  <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value, subcategory_id: '' }))} className="input">
                    <option value="">Sin categoría</option>
                    {rootCategories.filter(c => c.kind === form.kind).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <button type="button" onClick={() => setNewCatForm({ name: '', description: '', parentId: '' })} className="text-xs text-brand-600 hover:text-brand-700 text-left flex items-center gap-1 mt-0.5">
                    <Plus className="h-3 w-3" /> Nueva categoría
                  </button>
                </div>

                {/* Subcategoría */}
                {form.category_id && (
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-xs font-medium text-foreground-muted">Subcategoría</label>
                    <select value={form.subcategory_id} onChange={e => setForm(p => ({ ...p, subcategory_id: e.target.value }))} className="input">
                      <option value="">Sin subcategoría</option>
                      {subCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="button" onClick={() => setNewCatForm({ name: '', description: '', parentId: form.category_id })} className="text-xs text-brand-600 hover:text-brand-700 text-left flex items-center gap-1 mt-0.5">
                      <Plus className="h-3 w-3" /> Nueva subcategoría
                    </button>
                  </div>
                )}

                {/* Formulario nueva categoría inline */}
                {newCatForm !== null && (
                  <div className="col-span-2 rounded-[var(--radius-md)] border border-brand-200 bg-brand-50 p-3 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-brand-700">{newCatForm.parentId ? 'Nueva subcategoría' : 'Nueva categoría'}</p>
                    <input value={newCatForm.name} onChange={e => setNewCatForm(p => p ? { ...p, name: e.target.value } : p)} placeholder="Nombre" className="input text-xs" />
                    <input value={newCatForm.description} onChange={e => setNewCatForm(p => p ? { ...p, description: e.target.value } : p)} placeholder="Descripción (opcional)" className="input text-xs" />
                    <div className="flex gap-2">
                      <Button type="button" size="sm" onClick={() => handleNewCategory('add')} disabled={newCatLoading}>{newCatLoading ? 'Guardando...' : 'Crear'}</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setNewCatForm(null)}>Cancelar</Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowing(false); setNewCatForm(null) }}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {[
        { label: 'Ingresos', items: ingresos, color: 'text-success' },
        { label: 'Gastos', items: gastos, color: 'text-danger' },
      ].map(({ label, items, color }) => (
        <div key={label}>
          <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-2">{label}</p>
          {items.length === 0
            ? <Card><CardContent className="p-4 text-sm text-foreground-muted">Sin {label.toLowerCase()} registrados.</CardContent></Card>
            : items.map(t => (
              <Card key={t.id} className="mb-2">
                <CardContent className="p-4">
                  {editing === t.id ? (
                    <div className="flex flex-col gap-3">
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
                          <label className="text-xs font-medium text-foreground-muted">Fecha</label>
                          <input type="date" value={editForm.date ?? ''} onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))} className="input" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-foreground-muted">Tipo</label>
                          <select value={editForm.kind ?? 'income'} onChange={e => setEditForm(p => ({ ...p, kind: e.target.value, category_id: '', subcategory_id: '' }))} className="input">
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
                        <div className="flex flex-col gap-1.5 col-span-2">
                          <label className="text-xs font-medium text-foreground-muted">Categoría</label>
                          <select value={editForm.category_id ?? ''} onChange={e => setEditForm(p => ({ ...p, category_id: e.target.value, subcategory_id: '' }))} className="input">
                            <option value="">Sin categoría</option>
                            {rootCategories.filter(c => c.kind === (editForm.kind ?? t.kind)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          <button type="button" onClick={() => setNewCatForm({ name: '', description: '', parentId: '' })} className="text-xs text-brand-600 hover:text-brand-700 text-left flex items-center gap-1 mt-0.5">
                            <Plus className="h-3 w-3" /> Nueva categoría
                          </button>
                        </div>
                        {editForm.category_id && (
                          <div className="flex flex-col gap-1.5 col-span-2">
                            <label className="text-xs font-medium text-foreground-muted">Subcategoría</label>
                            <select value={editForm.subcategory_id ?? ''} onChange={e => setEditForm(p => ({ ...p, subcategory_id: e.target.value }))} className="input">
                              <option value="">Sin subcategoría</option>
                              {editSubCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <button type="button" onClick={() => setNewCatForm({ name: '', description: '', parentId: editForm.category_id! })} className="text-xs text-brand-600 hover:text-brand-700 text-left flex items-center gap-1 mt-0.5">
                              <Plus className="h-3 w-3" /> Nueva subcategoría
                            </button>
                          </div>
                        )}
                        {newCatForm !== null && (
                          <div className="col-span-2 rounded-[var(--radius-md)] border border-brand-200 bg-brand-50 p-3 flex flex-col gap-2">
                            <p className="text-xs font-semibold text-brand-700">{newCatForm.parentId ? 'Nueva subcategoría' : 'Nueva categoría'}</p>
                            <input value={newCatForm.name} onChange={e => setNewCatForm(p => p ? { ...p, name: e.target.value } : p)} placeholder="Nombre" className="input text-xs" />
                            <input value={newCatForm.description} onChange={e => setNewCatForm(p => p ? { ...p, description: e.target.value } : p)} placeholder="Descripción (opcional)" className="input text-xs" />
                            <div className="flex gap-2">
                              <Button type="button" size="sm" onClick={() => handleNewCategory('edit')} disabled={newCatLoading}>{newCatLoading ? 'Guardando...' : 'Crear'}</Button>
                              <Button type="button" variant="ghost" size="sm" onClick={() => setNewCatForm(null)}>Cancelar</Button>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => { setEditing(null); setNewCatForm(null) }} className="text-foreground-muted hover:text-foreground"><X className="h-4 w-4" /></button>
                        <button onClick={() => handleEdit(t.id)} className="text-success hover:text-success/80"><Check className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                        <p className="text-xs text-foreground-muted">
                          {t.is_recurring ? 'Mensual' : 'Único'}
                          {t.date && <span> · {displayDate(t.date)}</span>}
                          {getCatName(t.category_id) && <span> · {getCatName(t.category_id)}</span>}
                          {getCatName(t.subcategory_id) && <span> / {getCatName(t.subcategory_id)}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className={`text-sm font-semibold ${color}`}>{formatCLP(t.amount)}</p>
                        <button onClick={() => { setEditing(t.id); setEditForm(t) }} className="text-foreground-subtle hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDelete(t.id)} className="text-foreground-subtle hover:text-danger"><Trash2 className="h-4 w-4" /></button>
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