import { Calendar, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDateShort } from '@/lib/utils'

interface UpcomingEvent {
  id: string
  label: string
  date: string
  amount: number
  type: 'expense' | 'income' | 'alert'
}

interface UpcomingEventsProps {
  events: UpcomingEvent[]
}

const typeConfig = {
  expense: { variant: 'danger' as const, sign: '-' },
  income: { variant: 'success' as const, sign: '+' },
  alert: { variant: 'warning' as const, sign: '' },
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Próximos eventos</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-3 pb-4">
        {events.map((event) => {
          const config = typeConfig[event.type]
          return (
            <div key={event.id} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-border-subtle mt-0.5">
                {event.type === 'alert' ? (
                  <AlertCircle className="h-3.5 w-3.5 text-warning" />
                ) : (
                  <Calendar className="h-3.5 w-3.5 text-foreground-muted" />
                )}
              </div>
              <div className="flex flex-1 flex-col min-w-0 gap-0.5">
                <span className="text-xs font-medium text-foreground leading-tight">{event.label}</span>
                <span className="text-[10px] text-foreground-muted">{formatDateShort(event.date)}</span>
              </div>
              {event.amount > 0 && (
                <Badge variant={config.variant} size="sm">
                  {config.sign}{formatCurrency(event.amount, 'CLP')}
                </Badge>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
