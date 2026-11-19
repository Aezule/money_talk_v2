import type { Transaction } from '../api/transactions'
import { formatCents, signedAmount } from '../lib/money'

type Props = { items: Transaction[]; onDelete: (id: string) => void }

export function TransactionList({ items, onDelete }: Props) {
  if (items.length === 0) return <p>Aucune transaction.</p>
  return (
    <ul aria-label="Transactions">
      {items.map((t, i) => (
        <li key={`${t.ID}-${i}`}>
          <time>{t.date ? new Date(t.date).toLocaleDateString('fr-FR') : '—'}</time>
          <span className="desc">
            <span>{t.description}</span>
            {t.isRecurring && <span title="Récurrente"> ↻</span>}
          </span>
          <span className={t.type}>{formatCents(signedAmount(t))}</span>
          <button onClick={() => t.ID && onDelete(t.ID)} aria-label={`Supprimer ${t.description}`}>
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}
