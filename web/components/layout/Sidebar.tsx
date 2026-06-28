'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  TrendingUp,
  BarChart3,
  Briefcase,
  Settings,
  ChevronDown,
  Mountain,
  UserCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockUniverses } from '@/data/mock'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { NavItem } from '@/types'

const navItems: NavItem[] = [
  { label: 'Inicio', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Movimientos', href: '/movimientos', icon: 'ArrowLeftRight' },
  { label: 'Objetivos', href: '/objetivos', icon: 'Target' },
  { label: 'Simulador', href: '/simulador', icon: 'TrendingUp' },
  { label: 'Patrimonio', href: '/patrimonio', icon: 'BarChart3' },
  { label: 'Mi Perfil', href: '/perfil', icon: 'UserCircle' },
]

const iconMap = {
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  TrendingUp,
  BarChart3,
  Briefcase,
  Settings,
  UserCircle,
}

export function Sidebar() {
  const pathname = usePathname()
  const activeUniverse = mockUniverses[0]

  return (
    <aside className="flex h-full w-[var(--sidebar-width)] flex-col border-r border-border bg-surface shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] bg-brand-600">
          <Mountain className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground">Kumbre</span>
      </div>

      {/* Universe switcher */}
      <div className="mx-3 mb-4">
        <button className="flex w-full items-center justify-between gap-2 rounded-[var(--radius-md)] px-3 py-2 text-left transition-colors hover:bg-border-subtle">
          <div className="flex items-center gap-2.5">
            <div
              className="h-5 w-5 rounded-full shrink-0"
              style={{ backgroundColor: activeUniverse?.color ?? '#6366f1' }}
            />
            <span className="text-xs font-medium text-foreground truncate max-w-[130px]">
              {activeUniverse?.name ?? 'Personal'}
            </span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-foreground-muted shrink-0" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard
          const active = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors duration-[120ms]',
                active
                  ? 'bg-brand-50 text-brand-700 font-medium'
                  : 'text-foreground-muted hover:text-foreground hover:bg-border-subtle'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom — settings + user */}
      <div className="border-t border-border px-3 py-3">
        <Link
          href="/configuracion"
          className={cn(
            'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors',
            pathname === '/configuracion'
              ? 'bg-brand-50 text-brand-700 font-medium'
              : 'text-foreground-muted hover:text-foreground hover:bg-border-subtle'
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Configuración
        </Link>

        <Link href="/perfil" className="mt-2 flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 hover:bg-border-subtle transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-semibold shrink-0">
            K
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-foreground truncate">Mi cuenta</span>
          </div>
        </Link>
      </div>
    </aside>
  )
}
