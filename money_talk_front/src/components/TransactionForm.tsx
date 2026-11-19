import { useState, type FormEvent } from 'react'
import type { TransactionInput } from '../api/transactions'
import { toCents } from '../lib/money'

type Props = { onSubmit: (input: TransactionInput) => Promise<boolean> }

const today = () => new Date().toISOString().slice(0, 10)

export function TransactionForm({ onSubmit }: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [date, setDate] = useState(today)
  const [isRecurring, setIsRecurring] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const cents = toCents(amount)
    if (!description.trim()) return setError('Description requise')
    if (cents === null) return setError('Montant invalide')
    setError(null)
    const ok = await onSubmit({
      description: description.trim(),
      amount: cents,
      type,
      date: new Date(date).toISOString(),
      isRecurring,
    })
    if (ok) {
      setDescription('')
      setAmount('')
      setIsRecurring(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Nouvelle transaction">
      <input aria-label="Description" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input aria-label="Montant" placeholder="0,00" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value as 'expense' | 'income')}>
        <option value="expense">Dépense</option>
        <option value="income">Revenu</option>
      </select>
      <input aria-label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <label>
        <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} /> Récurrente
      </label>
      <button type="submit">Ajouter</button>
      {error && <p role="alert" className="error">{error}</p>}
    </form>
  )
}
