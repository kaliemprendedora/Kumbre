// Pure date utilities used by all engines. No external dependencies.

export function parseDate(iso: string): Date {
  return new Date(iso)
}

export function toISOMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
}

export function monthsBetweenISO(from: string, to: string): number {
  return monthsBetween(parseDate(from), parseDate(to))
}

export function addMonthsISO(iso: string, months: number): string {
  return toISOMonth(addMonths(parseDate(iso), months))
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime()
}

export function isAfter(a: Date, b: Date): boolean {
  return a.getTime() > b.getTime()
}

export function clampMonths(months: number): number {
  const VALID = [1, 3, 6, 12, 24, 60]
  return VALID.reduce((prev, curr) =>
    Math.abs(curr - months) < Math.abs(prev - months) ? curr : prev
  )
}
