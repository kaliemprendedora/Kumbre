import type { Metadata } from 'next'
import { User, Globe, Bell, Palette, Shield, Database } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Separator } from '@/components/ui/Separator'
import { mockUser } from '@/data/mock'

export const metadata: Metadata = { title: 'Configuración' }

const sections = [
  { icon: User, label: 'Perfil', description: 'Nombre, email y foto de perfil' },
  { icon: Globe, label: 'Universos', description: 'Gestiona tus espacios financieros' },
  { icon: Bell, label: 'Notificaciones', description: 'Alertas y recordatorios' },
  { icon: Palette, label: 'Apariencia', description: 'Tema y preferencias de display' },
  { icon: Shield, label: 'Seguridad', description: 'Contraseña y autenticación' },
  { icon: Database, label: 'Datos', description: 'Exportar, importar o eliminar datos' },
]

export default function ConfiguracionPage() {
  return (
    <div className="flex flex-col gap-6 animate-slide-up max-w-2xl">
      {/* Profile summary */}
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xl font-bold shrink-0">
            {mockUser.name[0]}
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">{mockUser.name}</p>
            <p className="text-sm text-foreground-muted">{mockUser.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Settings list */}
      <Card>
        <CardContent className="p-0">
          <ul>
            {sections.map((section, i) => {
              const Icon = section.icon
              return (
                <li key={section.label}>
                  <button className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-border-subtle transition-colors cursor-pointer">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-border-subtle">
                      <Icon className="h-4 w-4 text-foreground-muted" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{section.label}</p>
                      <p className="text-xs text-foreground-muted">{section.description}</p>
                    </div>
                    <span className="text-foreground-subtle text-sm">›</span>
                  </button>
                  {i < sections.length - 1 && <Separator />}
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-foreground-subtle">Kumbre v0.1.0 · MVP</p>
    </div>
  )
}
