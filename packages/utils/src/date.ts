import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

export function formatDate(date: Date | string, formatStr: string = 'PPP'): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? format(d, formatStr) : 'Invalid date'
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : 'Invalid date'
}

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && isValid(date)
}
