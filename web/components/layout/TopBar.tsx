'use client'

import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui'
import { mockUser } from '@/data/mock'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/movimientos': 'Movimientos',
  '/objetivos': 'Objetivos',
  '/simulador': 'Simulador',
  '/patrimonio': 'Patrimonio',
  '/empresa': 'Empresa',
  '/configuracion': 'Configuración',
}

export function TopBar() {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'Kumbre'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-6 shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        {pathname === '/dashboard' && (
          <p className="text-xs text-foreground-muted">
            {greeting}, {mockUser.name.split(' ')[0]}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notificaciones">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
