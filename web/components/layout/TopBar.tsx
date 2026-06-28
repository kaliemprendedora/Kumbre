'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Bell, LogOut } from 'lucide-react'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/movimientos': 'Movimientos',
  '/objetivos': 'Objetivos',
  '/simulador': 'Simulador',
  '/patrimonio': 'Patrimonio',
  '/empresa': 'Empresa',
  '/configuracion': 'Configuración',
}

export function TopBar({ userName }: { userName?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const title = pageTitles[pathname] ?? 'Kumbre'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const firstName = userName?.split(' ')[0] ?? ''

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-6 shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        {pathname === '/dashboard' && firstName && (
          <p className="text-xs text-foreground-muted">
            {greeting}, {firstName}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notificaciones">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Cerrar sesión" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
