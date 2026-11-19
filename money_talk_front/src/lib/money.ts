import type { Transaction } from '../api/transactions'

export function toCents(input: string): number | null {
  const trimmed = input.trim().replace(',', '.')
  if (!trimmed) return null
  const n = Number(trimmed)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100)
}

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export const formatCents = (cents: number) => eur.format(cents / 100)

export const signedAmount = (t: Transaction) =>
  t.type === 'expense' ? -(t.amount ?? 0) : (t.amount ?? 0)

export const balance = (ts: Transaction[]) => ts.reduce((sum, t) => sum + signedAmount(t), 0)
