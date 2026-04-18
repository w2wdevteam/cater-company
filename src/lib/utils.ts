import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  date: string | Date,
  pattern: string = 'MMM d, yyyy',
): string {
  if (!date) return '—'
  return format(new Date(date), pattern)
}

export function formatDateTime(date: string | Date): string {
  if (!date) return '—'
  return format(new Date(date), 'MMM d, yyyy • h:mm a')
}

export function formatCurrency(
  amount: number | string,
): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(value)) return '—'
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
