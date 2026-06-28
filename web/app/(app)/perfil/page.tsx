import type { Metadata } from 'next'
import Link from 'next/link'
import { Wallet, ArrowLeftRight, CreditCard, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Mi Perfil Financiero' }

const sections = [
  { href: '/perfil/cuentas', icon: Wallet, label: 'Cuentas', description: 'Banco, ahorro e inversiones' },
  { href: '/perfil/transacciones', icon: ArrowLeftRight, label: 'Ingresos y Gastos', description: 'Sueldos, arriendos y gastos fijos' },
  { href: '/perfil/deudas', icon: CreditCard, label: 'Deudas', description: 'Créditos y tarjetas' },
  { href: '/perfil/objetivos', icon: Target, label: 'Objetivos', description: 'Metas de ahorro e inversión' },
]

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.user_metadata?.name ?? user?.email ?? 'Usuario'

  return (
    <div className="flex flex-col gap-6 animate-slide-up max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Mi Perfil Financiero</h2>
        <p className="text-sm text-foreground-muted">Ingresa tus datos reales para que Kumbre calcule tu situación financiera.</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xl font-bold shrink-0">
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{name}</p>
            <p className="text-sm text-foreground-muted">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <ul>
            {sections.map((section, i) => {
              const Icon = section.icon
              return (
                <li key={section.href}>
                  <Link href={section.href} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-border-subtle transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-border-subtle">
                      <Icon className="h-4 w-4 text-foreground-muted" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{section.label}</p>
                      <p className="text-xs text-foreground-muted">{section.description}</p>
                    </div>
                    <span className="text-foreground-subtle text-sm">›</span>
                  </Link>
                  {i < sections.length - 1 && <div className="border-b border-border mx-5" />}
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
