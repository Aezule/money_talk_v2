import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TransactionForm } from '../../src/components/TransactionForm'

describe('TransactionForm', () => {
  it('envoie la transaction quand le formulaire est rempli', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true)
    render(<TransactionForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Description'), 'Salaire')
    await userEvent.type(screen.getByLabelText('Montant'), '2500')
    await userEvent.selectOptions(screen.getByLabelText('Type'), 'income')
    await userEvent.click(screen.getByText('Ajouter'))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const transaction = onSubmit.mock.calls[0][0]
    expect(transaction.description).toBe('Salaire')
    expect(transaction.amount).toBe(250000)
    expect(transaction.type).toBe('income')
  })

  it('vide le formulaire apres l envoi', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true)
    render(<TransactionForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Description'), 'Courses')
    await userEvent.type(screen.getByLabelText('Montant'), '12')
    await userEvent.click(screen.getByText('Ajouter'))

    expect(screen.getByLabelText('Description')).toHaveValue('')
    expect(screen.getByLabelText('Montant')).toHaveValue('')
  })

  it('affiche une erreur si la description est vide', async () => {
    const onSubmit = vi.fn()
    render(<TransactionForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Montant'), '12')
    await userEvent.click(screen.getByText('Ajouter'))

    expect(screen.getByText('Description requise')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('affiche une erreur si le montant est invalide', async () => {
    const onSubmit = vi.fn()
    render(<TransactionForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Description'), 'Courses')
    await userEvent.type(screen.getByLabelText('Montant'), 'abc')
    await userEvent.click(screen.getByText('Ajouter'))

    expect(screen.getByText('Montant invalide')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
