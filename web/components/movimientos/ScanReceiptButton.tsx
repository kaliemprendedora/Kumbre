'use client'

import { useRef, useState } from 'react'
import { Camera, X, Check, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import type { ScannedTransaction } from '@/app/api/scan-receipt/route'

interface ReviewTransaction {
  date: string
  description: string
  amount: number
  type: 'expense' | 'income'
  rawText: string
  categoryId?: string
}

interface Category {
  id: string
  name: string
  color: string
  type: string
}

interface MerchantRule {
  keyword: string
  categoryId: string
}

interface ScanReceiptButtonProps {
  categories: Category[]
  merchantRules?: MerchantRule[]
  onSave: (transactions: ReviewTransaction[]) => Promise<void>
}

function applyRules(tx: ScannedTransaction, rules: MerchantRule[]): string | undefined {
  const text = (tx.description + ' ' + tx.rawText).toLowerCase()
  for (const rule of rules) {
    if (text.includes(rule.keyword.toLowerCase())) return rule.categoryId
  }
  return undefined
}

export function ScanReceiptButton({ categories, merchantRules = [], onSave }: ScanReceiptButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const today = new Date().toISOString().slice(0, 10)
  const [state, setState] = useState<'idle' | 'scanning' | 'review' | 'saving'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<ReviewTransaction[]>([])

  async function handleFile(file: File) {
    setState('scanning')
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/scan-receipt', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al procesar la imagen')
      const withCategories = (data.transactions as Array<Record<string, unknown>>).map((tx) => ({
        date: String(tx['date'] ?? today),
        description: String(tx['description'] ?? ''),
        amount: Number(tx['amount'] ?? 0),
        type: (String(tx['type'] ?? 'expense')) as 'expense' | 'income',
        rawText: String(tx['rawText'] ?? ''),
        categoryId: applyRules(tx as unknown as ScannedTransaction, merchantRules),
      }))
      setTransactions(withCategories)
      setState('review')
    } catch (e: any) {
      setError(e.message)
      setState('idle')
    }
  }

  async function handleSave() {
    setState('saving')
    try {
      await onSave(transactions)
      setState('idle')
      setTransactions([])
    } catch (e: any) {
      setError(e.message)
      setState('review')
    }
  }

  if (state === 'review' || state === 'saving') {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
        <div className="bg-surface rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] w-full max-w-lg max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Movimientos detectados</h2>
            <button onClick={() => setState('idle')} className="text-foreground-muted hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {transactions.map((tx, i) => (
              <div key={i} className="border border-border rounded-[var(--radius-lg)] p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{tx.description}</p>
                    <p className="text-xs text-foreground-muted mt-0.5">{tx.date || 'Sin fecha'}</p>
                  </div>
                  <span className={`text-sm font-semibold shrink-0 ${tx.type === 'income' ? 'text-success' : 'text-foreground'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, 'CLP')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-foreground-muted">Categoría:</span>
                  <select
                    value={tx.categoryId ?? ''}
                    onChange={(e) => {
                      setTransactions(transactions.map((t, j) =>
                        j === i ? { ...t, categoryId: e.target.value || undefined } as ReviewTransaction : t
                      ))
                    }}
                    className="text-xs border border-border rounded-[var(--radius-md)] bg-surface text-foreground px-2 py-1 flex-1"
                  >
                    <option value="">Sin categoría</option>
                    {categories
                      .filter((c) => c.type === tx.type || c.type === 'transfer')
                      .map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                  </select>
                  {tx.categoryId && (
                    <Badge variant="muted" size="sm" style={{
                      backgroundColor: (categories.find(c => c.id === tx.categoryId)?.color ?? '#888') + '20',
                      color: categories.find(c => c.id === tx.categoryId)?.color ?? '#888',
                    }}>
                      auto
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border flex gap-3">
            <Button variant="secondary" size="sm" onClick={() => setState('idle')} className="flex-1">
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={state === 'saving'}
              className="flex-1"
            >
              {state === 'saving' ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Guardando...</>
              ) : (
                <><Check className="h-3.5 w-3.5" /> Guardar {transactions.length} movimiento{transactions.length !== 1 ? 's' : ''}</>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
      <div className="flex flex-col items-start gap-1">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={state === 'scanning'}
        >
          {state === 'scanning' ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analizando...</>
          ) : (
            <><Camera className="h-3.5 w-3.5" /> Subir boleta</>
          )}
        </Button>
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-danger">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </div>
        )}
      </div>
    </>
  )
}
