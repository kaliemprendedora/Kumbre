'use client'

import { useState, useMemo } from 'react'
import { ArrowDownLeft, ArrowUpRight, Search, Plus, Trash2, Check, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Tx = {
  id: string; description: string; amount: number; kind: string
  is_recurring: boolean; account_id: string; date: string; is_business: boolean
  category_id?: string | null
}
type Cuenta = { id: string; name: string; is_business: boolean }
type Category = { id: string; name: string; kind: string; parent_id: string | null }
type FormState = {
  description: string; amount: string; kind: string; is_recurring: boolean
  account_id: string; date: string; category_id: string
}

function localToday() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function displayDate(s?: string | null) {
  if (!s) return ''
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
}

function emptyForm(accountId: string): FormState {
  return { description: '', amount: '', kind: 'expense', is_recurring: false, account_id: accountId, date: localToday(), category_id: '' }
}

// FormFields has its own local state for inline creation forms — no focus loss
function FormFields({
  f, setF, cuentas, categories, isBusiness,
  onSaveNewCat, onSaveNewAccount,
}: {
  f: FormState
  setF: (updater: (p: FormState) => FormState) => void
  cuentas: Cuenta[]
  categories: Category[]
  isBusiness: boolean
  onSaveNewCat: (name: string, kind: string, parentId: string) => Promise<string | null>
  onSaveNewAccount: (name: string, isBusiness: boolean, kind: string, balance: number, isLiquid: boolean) => Promise<string | null>
}) {
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatKind, setNewCatKind] = useState(f.kind)
  const [newCatParent, setNewCatParent] = useState('')
  const [newCatLoading, setNewCatLoading] = useState(false)

  const [showNewAcc, setShowNewAcc] = useState(false)
  const [newAccName, setNewAccName] = useState('')
  const [newAccKind, setNewAccKind] = useState('corriente')
  const [newAccBalance, setNewAccBalance] = useState('0')
  const [newAccLiquid, setNewAccLiquid] = useState(true)
  const [newAccLoading, setNewAccLoading] = useState(false)
  const [extraCuentas, setExtraCuentas] = useState<Cuenta[]>([])

  const allCuentas = [...cuentas, ...extraCuentas]
  const relevCuentas = allCuentas.filter(c => c.is_business === isBusiness)
  const parentCategories = categories.filter(c => !c.parent_id)
  const parents = parentCategories.filter(c => c.kind === f.kind)
  const catMap = new Map(categories.map(c => [c.id, c]))
  const selectedCat = catMap.get(f.category_id)
  const parentId = selectedCat?.parent_id
    ? selectedCat.parent_id
    : (selectedCat && !selectedCat.parent_id ? selectedCat.id : '')
  const subs = parentId ? categories.filter(c => c.parent_id === parentId && c.kind === f.kind) : []

  async function saveNewCat() {
    if (!newCatName.trim()) return
    setNewCatLoading(true)
    const newId = await onSaveNewCat(newCatName.trim(), newCatKind, newCatParent)
    if (newId) {
      setF(p => ({ ...p, category_id: newId }))
      setNewCatName('')
      setNewCatParent('')
      setShowNewCat(false)
    }
    setNewCatLoading(false)
  }

  async function saveNewAcc() {
    if (!newAccName.trim()) return
    setNewAccLoading(true)
    const trimmed = newAccName.trim()
    try {
      const newId = await onSaveNewAccount(trimmed, isBusiness, newAccKind, Number(newAccBalance) || 0, newAccLiquid)
      if (newId) {
        setExtraCuentas(p => [...p, { id: newId, name: trimmed, is_business: isBusiness }])
        setF(p => ({ ...p, account_id: newId }))
        setNewAccName('')
        setNewAccBalance('0')
        setShowNewAcc(false)
      }
    } catch (err) {
      console.error('Error creando cuenta:', err)
    } finally {
      setNewAccLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-1.5 col-span-2">
        <label className="text-xs font-medium text-foreground-muted">Descripción</label>
        <input value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} required placeholder="Ej: Sueldo, Supermercado" className="input" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground-muted">Monto ($)</label>
        <input value={f.amount} onChange={e => setF(p => ({ ...p, amount: e.target.value }))} required placeholder="Ej: 500000" className="input" inputMode="numeric" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground-muted">Tipo</label>
        <select value={f.kind} onChange={e => setF(p => ({ ...p, kind: e.target.value, category_id: '' }))} className="input">
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 col-span-2">
        <label className="text-xs font-medium text-foreground-muted">Cuenta</label>
        <select value={f.account_id} onChange={e => setF(p => ({ ...p, account_id: e.target.value }))} className="input">
          {relevCuentas.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {showNewAcc ? (
          <div className="flex flex-col gap-2 p-3 bg-border-subtle rounded-[var(--radius-md)] mt-1">
            <p className="text-xs font-medium text-foreground-muted">Nueva cuenta</p>
            <input value={newAccName} onChange={e => setNewAccName(e.target.value)} placeholder="Ej: Efectivo, Banco Chile" className="input" autoFocus />
            <select value={newAccKind} onChange={e => setNewAccKind(e.target.value)} className="input">
              <option value="corriente">Cuenta corriente</option>
              <option value="ahorro">Cuenta ahorro</option>
              <option value="efectivo">Efectivo</option>
              <option value="credito">Crédito</option>
              <option value="inversion">Inversión</option>
              <option value="otro">Otro</option>
            </select>
            <input value={newAccBalance} onChange={e => setNewAccBalance(e.target.value)} placeholder="Saldo inicial (0)" className="input" inputMode="numeric" />
            <label className="flex items-center gap-2 text-xs text-foreground-muted cursor-pointer">
              <input type="checkbox" checked={newAccLiquid} onChange={e => setNewAccLiquid(e.target.checked)} />
              Es líquida (disponible de inmediato)
            </label>
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={saveNewAcc} disabled={newAccLoading || !newAccName.trim()}>
                {newAccLoading ? 'Guardando…' : 'Guardar'}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewAcc(false)}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setShowNewAcc(true)} className="text-xs text-brand-500 hover:text-brand-600 text-left font-medium mt-1">
            + Nueva cuenta
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5 col-span-2">
        <label className="text-xs font-medium text-foreground-muted">Fecha</label>
        <input type="date" value={f.date} onChange={e => setF(p => ({ ...p, date: e.target.value }))} required className="input" />
      </div>

      <div className="flex flex-col gap-1.5 col-span-2">
        <label className="text-xs font-medium text-foreground-muted">Categoría</label>
        <select value={parentId} onChange={e => setF(p => ({ ...p, category_id: e.target.value }))} className="input">
          <option value="">Sin categoría</option>
          {parents.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {parentId && subs.length > 0 && (
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-xs font-medium text-foreground-muted">Subcategoría</label>
          <select
            value={selectedCat?.parent_id ? f.category_id : ''}
            onChange={e => setF(p => ({ ...p, category_id: e.target.value || parentId }))}
            className="input"
          >
            <option value="">Solo categoría principal</option>
            {subs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {showNewCat ? (
        <div className="col-span-2 flex flex-col gap-2 p-3 bg-border-subtle rounded-[var(--radius-md)]">
          <p className="text-xs font-medium text-foreground-muted">Nueva categoría</p>
          <input value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="Nombre" className="input" autoFocus />
          <select value={newCatKind} onChange={e => setNewCatKind(e.target.value)} className="input">
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
          <select value={newCatParent} onChange={e => setNewCatParent(e.target.value)} className="input">
            <option value="">Sin padre (categoría principal)</option>
            {parentCategories.filter(c => c.kind === newCatKind).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={saveNewCat} disabled={newCatLoading || !newCatName.trim()}>
              {newCatLoading ? 'Guardando…' : 'Guardar'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewCat(false)}>Cancelar</Button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => { setShowNewCat(true); setNewCatKind(f.kind) }} className="col-span-2 text-xs text-brand-500 hover:text-brand-600 text-left font-medium">
          + Nueva categoría
        </button>
      )}

      <div className="flex flex-col gap-1.5 col-span-2">
        <label className="text-xs font-medium text-foreground-muted">¿Es mensual?</label>
        <select value={f.is_recurring ? 'si' : 'no'} onChange={e => setF(p => ({ ...p, is_recurring: e.target.value === 'si' }))} className="input">
          <option value="no">No (único)</option>
          <option value="si">Sí (mensual)</option>
        </select>
      </div>
    </div>
  )
}

export function MovimientosClient({
  initial, cuentas, initialCategories,
}: {
  initial: Tx[]; cuentas: Cuenta[]; initialCategories: Category[]
}) {
  const router = useRouter()
  const [txs, setTxs] = useState(initial)
  const [categories, setCategories] = useState(initialCategories)
  const [allCuentas, setAllCuentas] = useState(cuentas)
  const [search, setSearch] = useState('')
  const [filterKind, setFilterKind] = useState<'all' | 'income' | 'expense'>('all')
  const [tab, setTab] = useState<'personal' | 'negocio'>('personal')
  const [showing, setShowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState | null>(null)
  const [editLoading, setEditLoading] = useState(false)

  const isBusiness = tab === 'negocio'
  const tabCuentas = allCuentas.filter(c => c.is_business === isBusiness)
  const accountMap = useMemo(() => new Map(allCuentas.map(c => [c.id, c.name])), [allCuentas])
  const catMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories])

  const [form, setForm] = useState<FormState>(emptyForm(cuentas[0]?.id ?? ''))

  const filtered = useMemo(() =>
    txs
      .filter(t => t.is_business === isBusiness)
      .filter(t => filterKind === 'all' || t.kind === filterKind)
      .filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [txs, search, filterKind, isBusiness]
  )

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.account_id) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('transactions').insert({
      user_id: user!.id,
      description: form.description,
      amount: Math.round(Number(String(form.amount).replace(/\D/g, ''))),
      kind: form.kind,
      is_recurring: form.is_recurring,
      account_id: form.account_id,
      date: form.date,
      is_business: isBusiness,
      category_id: form.category_id || null,
    }).select().single()
    if (data) {
      setTxs(p => [data, ...p])
      setShowing(false)
      setForm(emptyForm(tabCuentas[0]?.id ?? ''))
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

  function startEdit(tx: Tx) {
    setEditId(tx.id)
    setEditForm({
      description: tx.description,
      amount: String(tx.amount),
      kind: tx.kind,
      is_recurring: tx.is_recurring,
      account_id: tx.account_id,
      date: tx.date,
      category_id: tx.category_id ?? '',
    })
  }

  async function handleSaveEdit(id: string) {
    if (!editForm) return
    setEditLoading(true)
    const supabase = createClient()
    const { data } = await supabase.from('transactions').update({
      description: editForm.description,
      amount: Math.round(Number(String(editForm.amount).replace(/\D/g, ''))),
      kind: editForm.kind,
      is_recurring: editForm.is_recurring,
      account_id: editForm.account_id,
      date: editForm.date,
      category_id: editForm.category_id || null,
    }).eq('id', id).select().single()
    if (data) {
      setTxs(p => p.map(t => t.id === id ? data : t))
      setEditId(null)
      setEditForm(null)
    }
    setEditLoading(false)
    router.refresh()
  }

  async function handleNewCategory(name: string, kind: string, parentId: string): Promise<string | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase.from('categories').insert({
      user_id: user!.id, name, kind, parent_id: parentId || null,
    }).select().single()
    if (data) setCategories(p => [...p, data])
    return data?.id ?? null
  }

  async function handleNewAccount(name: string, business: boolean, kind: string, balance: number, isLiquid: boolean): Promise<string | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data, error } = await supabase.from('accounts').insert({
      user_id: user.id, name, kind, balance, is_liquid: isLiquid, is_business: business,
    }).select().single()
    if (error) {
      const { data: existing } = await supabase.from('accounts')
        .select('*').eq('user_id', user.id).eq('name', name).eq('is_business', business).maybeSingle()
      if (existing) {
        setAllCuentas(p => p.find(c => c.id === existing.id) ? p : [...p, existing])
        return existing.id
      }
      console.error('Error insertando cuenta:', error)
      return null
    }
    if (data) {
      setAllCuentas(p => [...p, data])
      return data.id
    }
    return null
  }

  function categoryLabel(catId?: string | null) {
    if (!catId) return null
    const cat = catMap.get(catId)
    if (!cat) return null
    if (cat.parent_id) {
      const parent = catMap.get(cat.parent_id)
      return parent ? `${parent.name} › ${cat.name}` : cat.name
    }
    return cat.name
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex gap-1 p-1 bg-border-subtle rounded-[var(--radius-md)] w-fit">
        {(['personal', 'negocio'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setShowing(false); setEditId(null) }}
            className={`px-4 py-1.5 text-sm font-medium rounded-[var(--radius-sm)] transition-colors capitalize ${tab === t ? 'bg-surface text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'}`}
          >
            {t === 'personal' ? '👤 Personal' : '🏢 Negocio'}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar movimientos..." className="input pl-9 w-full" />
          </div>
          <select value={filterKind} onChange={e => setFilterKind(e.target.value as typeof filterKind)} className="input w-auto">
            <option value="all">Todos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>
        </div>
        <Button variant="primary" size="sm" onClick={() => { setShowing(true); setEditId(null) }} disabled={tabCuentas.length === 0}>
          <Plus className="h-3.5 w-3.5" />
          Movimiento
        </Button>
      </div>

      {tabCuentas.length === 0 && (
        <div className="rounded-[var(--radius-lg)] bg-warning-bg border border-warning/30 p-4 text-sm text-foreground-muted">
          {isBusiness
            ? <>Primero agrega una cuenta de <strong>negocio</strong> en <a href="/perfil/cuentas" className="underline font-medium text-foreground">Mi Perfil → Cuentas</a>.</>
            : <>Primero agrega una cuenta en <a href="/perfil/cuentas" className="underline font-medium text-foreground">Mi Perfil → Cuentas</a>.</>}
        </div>
      )}

      {showing && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Nuevo movimiento {isBusiness ? '· Negocio' : '· Personal'}</h3>
              <FormFields
                f={form}
                setF={(fn) => setForm(fn)}
                cuentas={allCuentas}
                categories={categories}
                isBusiness={isBusiness}
                onSaveNewCat={handleNewCategory}
                onSaveNewAccount={handleNewAccount}
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowing(false)}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {editId && editForm && (
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Editando movimiento</h3>
              <FormFields
                key={editId}
                f={editForm}
                setF={(fn) => setEditForm(p => p ? fn(p) : p)}
                cuentas={allCuentas}
                categories={categories}
                isBusiness={isBusiness}
                onSaveNewCat={handleNewCategory}
                onSaveNewAccount={handleNewAccount}
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => { setEditId(null); setEditForm(null) }}>
                  <X className="h-3.5 w-3.5" /> Cancelar
                </Button>
                <Button type="button" size="sm" disabled={editLoading} onClick={() => handleSaveEdit(editId)}>
                  <Check className="h-3.5 w-3.5" /> {editLoading ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-foreground-muted py-12">
              {search ? 'Sin resultados para tu búsqueda.' : `No tienes movimientos ${isBusiness ? 'de negocio' : 'personales'} registrados.`}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {filtered.map((tx) => {
                const isIncome = tx.kind === 'income'

                return (
                  <li key={tx.id} className="flex items-center gap-3 px-4 py-4 hover:bg-border-subtle transition-colors">
                    <button onClick={() => startEdit(tx)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isIncome ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                        {isIncome ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-1 min-w-0 flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground truncate">{tx.description}</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs text-foreground-muted">{displayDate(tx.date)}</span>
                          {accountMap.get(tx.account_id) && (
                            <><span className="text-foreground-subtle text-xs">·</span><span className="text-xs text-foreground-muted">{accountMap.get(tx.account_id)}</span></>
                          )}
                          {categoryLabel(tx.category_id) && (
                            <><span className="text-foreground-subtle text-xs">·</span><span className="text-xs text-foreground-muted">{categoryLabel(tx.category_id)}</span></>
                          )}
                          {tx.is_recurring && <span className="text-[10px] text-brand-500 font-medium bg-brand-50 px-1.5 py-0.5 rounded-full">Mensual</span>}
                        </div>
                      </div>
                      <span className={`text-sm font-semibold shrink-0 ${isIncome ? 'text-success' : 'text-foreground'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(Math.abs(tx.amount), 'CLP')}
                      </span>
                    </button>
                    <button onClick={() => handleDelete(tx.id)} className="p-2 text-foreground-subtle hover:text-danger transition-colors shrink-0" aria-label="Eliminar">
                      <Trash2 className="h-4 w-4" />
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
