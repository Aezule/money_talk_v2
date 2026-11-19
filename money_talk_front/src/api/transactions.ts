import type { components } from './schema'

export type Transaction = components['schemas']['Transaction']
export type TransactionInput = components['schemas']['TransactionInput']

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

const baseUrl = () => `${window.location.origin}/api`

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(baseUrl() + path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  const text = await res.text()
  const body = text ? JSON.parse(text) : undefined
  if (!res.ok) throw new ApiError(res.status, body?.message ?? `HTTP ${res.status}`)
  return body as T
}

export const listTransactions = () => request<Transaction[]>('/transactions')

export const createTransaction = (input: TransactionInput) =>
  request<Transaction>('/transactions', { method: 'POST', body: JSON.stringify(input) })

export const deleteTransaction = (id: string) =>
  request<void>(`/transactions/${encodeURIComponent(id)}`, { method: 'DELETE' })
