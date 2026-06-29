'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Bell, LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/movimientos': 'Movimientos',
  '/objetivos': 'Objetivos',
  '/simulador': 'Simulador',
  '/patrimonio': 'Patrimonio',
  '/proyeccion': 'Proyección',
  '/perfil': 'Mi Perfil',
  '/configuracion': 'Configuración',
}

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const [firstName, setFirstName] = useState('')

  const title = Object.entries(pageTitles).find(([key]) => pathname === key || pathname.startsWith(key + '/'))?.[1] ?? 'Kumbre'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      const name = user?.user_metadata?.name ?? user?.email ?? ''
      setFirstName(name.split(' ')[0])
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-foreground-muted hover:text-foreground p-1 -ml-1"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-foreground">{title}</h1>
          {pathname === '/dashboard' && firstName && (
            <p className="text-xs text-foreground-muted">
              {greeting}, {firstName}
            </p>
          )}
        </div>
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
