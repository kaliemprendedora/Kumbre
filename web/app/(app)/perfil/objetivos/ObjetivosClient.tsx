'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Pencil, Check, X, Calendar, Banknote, ListOrdered } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCLP } from '@/lib/format'

type Objetivo = { id: string; name: string; kind: string; target_amount: number; current_amount: number; target_date: string; monthly_contribution: number; start_date?: string }
type CalcMode = 'por_fecha' | 'por_aporte' | 'por_etapas'
type Stage = { months: number; amount: number }

const kindSuggestions = [
  'Casa', 'Emergencia', 'Viaje', 'Educación', 'Jubilación',
  'Auto', 'Negocio', 'Salud', 'Tecnología', 'Otro',
]

function monthsDiff(from: Date, to: Date) {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
}

function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10)
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })
}

export function ObjetivosClient({ initial }: { initial: Objetivo[] }) {
  const router = useRouter()
  const [objetivos, setObjetivos] = useState(initial)
  const [showing, setShowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Objetivo>>({})

  const [name, setName] = useState('')
  const [kind, setKind] = useState('')
  const [target, setTarget] = useState('')
  const [current, setCurrent] = useState('')
  const [mode, setMode] = useState<CalcMode>('por_fecha')
  const [targetDate, setTargetDate] = useState('')
  const [monthlyInput, setMonthlyInput] = useState('')
  const [startDate, setStartDate] = useState('')
  const [stages, setStages] = useState<Stage[]>([{ months: 3, amount: 0 }])

  const parse = (v: string | number) =>
    typeof v === 'number' ? v : Math.max(0, Math.round(Number(String(v).replace(/\D/g, ''))))

  const from = useMemo(() => startDate ? new Date(startDate) : new Date(), [startDate])

  const calc = useMemo(() => {
    const targetAmt = parse(target)
    const currentAmt = parse(current)
    const remaining = Math.max(0, targetAmt - currentAmt)

    if (mode === 'por_fecha' && targetDate) {
      const months = monthsDiff(from, new Date(targetDate))
      if (months <= 0) return null
      const monthly = Math.ceil(remaining / months)
      return { monthly, targetDate, months, stages: null }
    }

    if (mode === 'por_aporte' && monthlyInput) {
      const monthly = parse(monthlyInput)
      if (monthly <= 0) return null
      const months = Math.ceil(remaining / monthly)
      if (months > 1200) return null
      const date = addMonths(from, months)
      return { monthly, targetDate: formatDateInput(date), months, stages: null }
    }

    if (mode === 'por_etapas' && stages.length > 0) {
      const validStages = stages.filter(s => s.months > 0 && s.amount > 0)
      if (validStages.length === 0) return null
      let accumulated = currentAmt
      let totalMonths = 0
      let reachedAt: number | null = null
      for (const s of validStages) {
        for (let m = 0; m < s.months; m++) {
          accumulated += s.amount
          totalMonths++
          if (reachedAt === null && accumulated >= targetAmt) {
            reachedAt = totalMonths
          }
        }
      }
      const finalDate = addMonths(from, totalMonths)
      const reachDate = reachedAt !== null ? addMonths(from, reachedAt) : null
      const firstStage = validStages[0]
      if (!firstStage) return null
      return {
        monthly: firstStage.amount,
        targetDate: reachDate ? formatDateInput(reachDate) : formatDateInput(finalDate),
        months: reachedAt ?? totalMonths,
        accumulated,
        targetAmt,
        reachDate,
        stages: validStages,
      }
    }

    return null
  }, [target, current, mode, targetDate, monthlyInput, startDate, stages, from])

  const motivaciones = [
    '¡Vas a lograrlo! Cada peso cuenta. 💪',
    '¡Objetivo creado! El primer paso ya está dado. 🚀',
    '¡Excelente! Tus metas merecen un plan. ⭐',
    '¡Perfecto! Ya estás un paso más cerca. 🎯',
    '¡Bien hecho! La constancia mueve montañas. 🏔️',
  ]

  function resetForm() {
    setName(''); setKind(''); setTarget(''); setCurrent('')
    setTargetDate(''); setMonthlyInput(''); setStartDate('')
    setStages([{ months: 3, amount: 0 }]); setMode('por_fecha')
    setSaveError(''); setShowing(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!calc) return
    setLoading(true)
    setSaveError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('objectives').insert({
      user_id: user!.id,
      name, kind,
      target_amount: parse(target),
      current_amount: parse(current),
      monthly_contribution: calc.monthly,
      target_date: calc.targetDate,
      start_date: startDate || null,
      contribution_schedule: calc.stages ? calc.stages : null,
    }).select().single()
    if (error) {
      setSaveError('No se pudo guardar: ' + error.message)
    } else if (data) {
      setObjetivos(p => [...p, data])
      const msg = motivaciones[Math.floor(Math.random() * motivaciones.length)] ?? '¡Objetivo guardado!'
      setSuccessMsg(msg)
      setTimeout(() => setSuccessMsg(''), 4000)
      resetForm()
      router.refresh()
    }
    setLoading(false)
  }

  async function handleEdit(id: string) {
    const supabase = createClient()
    await supabase.from('objectives').update({
      name: editForm.name, kind: editForm.kind,
      target_amount: editForm.target_amount,
      current_amount: editForm.current_amount,
      monthly_contribution: editForm.monthly_contribution,
      target_date: editForm.target_date,
      start_date: editForm.start_date || null,
    }).eq('id', id)
    setObjetivos(p => p.map(o => o.id === id ? { ...o, ...editForm } as Objetivo : o))
    setEditing(null)
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

      {successMsg && (
        <div className="rounded-[var(--radius-lg)] bg-success-bg border border-success/30 px-4 py-3 text-sm font-medium text-success animate-slide-up">
          {successMsg}
        </div>
      )}

      {showing && (
        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Nuevo objetivo</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Nombre</label>
                  <input value={name} onChange={e => setName(e.target.value)} required placeholder="Ej: Casa propia" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Categoría</label>
                  <input list="kind-suggestions" value={kind} onChange={e => setKind(e.target.value)} placeholder="Ej: Viaje, Casa, Negocio..." className="input" />
                  <datalist id="kind-suggestions">{kindSuggestions.map(s => <option key={s} value={s} />)}</datalist>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Meta ($)</label>
                  <input value={target} onChange={e => setTarget(e.target.value)} required placeholder="Ej: 12.000.000" className="input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Ya tengo ahorrado ($)</label>
                  <input value={current} onChange={e => setCurrent(e.target.value)} required placeholder="0" className="input" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-foreground-muted">¿Cómo quieres planificar?</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'por_fecha', icon: <Calendar className="h-4 w-4 shrink-0" />, label: 'Por fecha', desc: 'Fijo cuándo quiero lograrlo' },
                    { value: 'por_aporte', icon: <Banknote className="h-4 w-4 shrink-0" />, label: 'Por aporte', desc: 'Fijo cuánto puedo ahorrar/mes' },
                    { value: 'por_etapas', icon: <ListOrdered className="h-4 w-4 shrink-0" />, label: 'Por etapas', desc: 'Montos distintos según el período' },
                  ] as const).map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMode(opt.value)}
                      className={`flex items-center gap-2 rounded-[var(--radius-md)] border p-3 text-left text-xs transition-colors ${
                        mode === opt.value
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-border text-foreground-muted hover:border-brand-300'
                      }`}
                    >
                      {opt.icon}
                      <div>
                        <p className="font-semibold">{opt.label}</p>
                        <p className="text-[10px] opacity-80">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {mode === 'por_fecha' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Fecha meta</label>
                  <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} required className="input" min={formatDateInput(new Date())} />
                </div>
              )}

              {mode === 'por_aporte' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground-muted">Aporte mensual ($)</label>
                  <input value={monthlyInput} onChange={e => setMonthlyInput(e.target.value)} required placeholder="Ej: 500.000" className="input" />
                </div>
              )}

              {mode === 'por_etapas' && (
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-medium text-foreground-muted">Etapas de ahorro</label>
                  {stages.map((s, i) => (
                    <div key={i} className="rounded-[var(--radius-md)] border border-border p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground-muted">Etapa {i + 1}</span>
                        {stages.length > 1 && (
                          <button type="button" onClick={() => setStages(p => p.filter((_, idx) => idx !== i))} className="text-foreground-subtle hover:text-danger">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-foreground-subtle">Duración (meses)</label>
                          <input
                            type="number"
                            min={1}
                            value={s.months || ''}
                            onChange={e => setStages(p => p.map((st, idx) => idx === i ? { ...st, months: Math.max(1, Number(e.target.value)) } : st))}
                            placeholder="3"
                            className="input"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-foreground-subtle">Monto mensual ($)</label>
                          <input
                            value={s.amount ? s.amount.toLocaleString('es-CL') : ''}
                            onChange={e => {
                              const val = Math.max(0, Math.round(Number(e.target.value.replace(/\D/g, ''))))
                              setStages(p => p.map((st, idx) => idx === i ? { ...st, amount: val } : st))
                            }}
                            placeholder="300.000"
                            className="input"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStages(p => [...p, { months: 3, amount: 0 }])}
                    className="text-xs text-brand-600 hover:text-brand-700 text-left flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Agregar etapa
                  </button>
                </div>
              )}

              {calc && (
                <div className="rounded-[var(--radius-md)] bg-brand-50 border border-brand-200 p-3 text-xs space-y-1">
                  {mode === 'por_fecha' && (
                    <p className="text-brand-700">
                      Necesitas ahorrar <span className="font-bold">{formatCLP(calc.monthly)}/mes</span> durante {calc.months} {calc.months === 1 ? 'mes' : 'meses'} para alcanzar tu meta.
                    </p>
                  )}
                  {mode === 'por_aporte' && (
                    <p className="text-brand-700">
                      Aportando <span className="font-bold">{formatCLP(calc.monthly)}/mes</span> llegarás a tu meta en <span className="font-bold">{formatMonthYear(new Date(calc.targetDate))}</span> ({calc.months} {calc.months === 1 ? 'mes' : 'meses'}).
                    </p>
                  )}
                  {mode === 'por_etapas' && 'accumulated' in calc && (
                    <>
                      {'reachDate' in calc && calc.reachDate ? (
                        <p className="text-brand-700 font-semibold">
                          ✅ Alcanzas tu meta en <span className="font-bold">{formatMonthYear(calc.reachDate)}</span> ({calc.months} meses).
                        </p>
                      ) : (
                        <p className="text-danger font-semibold">
                          ⚠️ Con estas etapas acumulas {formatCLP(calc.accumulated ?? 0)} — faltan {formatCLP(Math.max(0, (calc.targetAmt ?? 0) - (calc.accumulated ?? 0)))} para la meta.
                        </p>
                      )}
                      <div className="mt-1 space-y-0.5">
                        {stages.map((s, i) => s.months > 0 && s.amount > 0 ? (
                          <p key={i} className="text-brand-600">Etapa {i + 1}: {s.months} meses × {formatCLP(s.amount)} = {formatCLP(s.months * s.amount)}</p>
                        ) : null)}
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground-muted">Fecha de inicio (opcional)</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input" />
                <p className="text-[10px] text-foreground-muted">Déjalo vacío si empieza hoy.</p>
              </div>

              {saveError && <p className="text-xs text-danger">{saveError}</p>}
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Cancelar</Button>
                <Button type="submit" size="sm" disabled={loading || !calc}>{loading ? 'Guardando...' : 'Guardar'}</Button>
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
              {editing === o.id ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground-muted">Nombre</label>
                    <input value={editForm.name ?? ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground-muted">Categoría</label>
                    <input list="kind-suggestions-edit" value={editForm.kind ?? ''} onChange={e => setEditForm(p => ({ ...p, kind: e.target.value }))} className="input" />
                    <datalist id="kind-suggestions-edit">{kindSuggestions.map(s => <option key={s} value={s} />)}</datalist>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground-muted">Meta ($)</label>
                    <input type="number" value={editForm.target_amount ?? 0} onChange={e => setEditForm(p => ({ ...p, target_amount: Number(e.target.value) }))} className="input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground-muted">Ahorrado ($)</label>
                    <input type="number" value={editForm.current_amount ?? 0} onChange={e => setEditForm(p => ({ ...p, current_amount: Number(e.target.value) }))} className="input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground-muted">Aporte mensual ($)</label>
                    <input type="number" value={editForm.monthly_contribution ?? 0} onChange={e => setEditForm(p => ({ ...p, monthly_contribution: Number(e.target.value) }))} className="input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground-muted">Fecha meta</label>
                    <input type="date" value={editForm.target_date ?? ''} onChange={e => setEditForm(p => ({ ...p, target_date: e.target.value }))} className="input" />
                  </div>
                  <div className="col-span-2 flex gap-2 justify-end">
                    <button onClick={() => setEditing(null)} className="text-foreground-muted hover:text-foreground"><X className="h-4 w-4" /></button>
                    <button onClick={() => handleEdit(o.id)} className="text-success hover:text-success/80"><Check className="h-4 w-4" /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{o.name}</p>
                      <p className="text-xs text-foreground-muted">
                        {o.kind || 'Objetivo'} · {formatCLP(o.monthly_contribution)}/mes
                        {o.target_date && <span className="ml-1">· Meta: {new Date(o.target_date).toLocaleDateString('es-CL', { month: 'short', year: 'numeric' })}</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{pct}%</p>
                        <p className="text-xs text-foreground-muted">{formatCLP(o.current_amount)} / {formatCLP(o.target_amount)}</p>
                      </div>
                      <button onClick={() => { setEditing(o.id); setEditForm(o) }} className="text-foreground-subtle hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(o.id)} className="text-foreground-subtle hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}