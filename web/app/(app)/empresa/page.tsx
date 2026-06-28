import type { Metadata } from 'next'
import { Briefcase } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { mockProjects, mockAccounts } from '@/data/mock'

export const metadata: Metadata = { title: 'Empresa' }

const statusConfig = {
  active: { label: 'Activo', variant: 'success' as const },
  completed: { label: 'Completado', variant: 'brand' as const },
  paused: { label: 'Pausado', variant: 'warning' as const },
}

export default function EmpresaPage() {
  const empresaAccounts = mockAccounts.filter((a) => a.universeId === 'universe-cambucho')

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      {/* Empresa accounts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {empresaAccounts.map((account) => (
          <Card key={account.id}>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-foreground-muted mb-2">{account.name}</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(account.balance, 'CLP')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Proyectos</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <ul className="divide-y divide-border">
            {mockProjects.map((project) => {
              const config = statusConfig[project.status as keyof typeof statusConfig]
              return (
                <li key={project.id} className="flex items-center justify-between px-5 py-4 hover:bg-border-subtle transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-brand-50">
                      <Briefcase className="h-4 w-4 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{project.name}</p>
                      {project.endDate && (
                        <p className="text-xs text-foreground-muted">Cierre: {formatDate(project.endDate)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {config && <Badge variant={config.variant}>{config.label}</Badge>}
                    {project.estimatedIncome > 0 && (
                      <span className="text-sm font-semibold text-foreground">
                        {formatCurrency(project.estimatedIncome, 'CLP')}
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
