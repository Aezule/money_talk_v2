import { useEffect, useState } from 'react'
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  type Transaction,
  type TransactionInput,
} from './api/transactions'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { balance, formatCents } from './lib/money'

const message = (e: unknown) => (e instanceof Error ? e.message : String(e))

export default function App() {
  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listTransactions()
      .then(setItems)
      .catch((e) => setError(message(e)))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(input: TransactionInput) {
    try {
      const created = await createTransaction(input)
      setItems((prev) => [created, ...prev])
      setError(null)
      return true
    } catch (e) {
      setError(message(e))
      return false
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTransaction(id)
      setItems((prev) => prev.filter((t) => t.ID !== id))
      setError(null)
    } catch (e) {
      setError(message(e))
    }
  }

  return (
    <main>
      <h1>Money Talk</h1>
      <p>
        Solde : <strong data-testid="balance">{formatCents(balance(items))}</strong>
      </p>
      <TransactionForm onSubmit={handleCreate} />
      {error && <p role="alert" className="error">Erreur : {error}</p>}
      {loading ? <p>Chargement…</p> : <TransactionList items={items} onDelete={handleDelete} />}
    </main>
  )
}
