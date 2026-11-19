import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import App from '../../src/App'

const transactions = [
  { ID: '1', description: 'Salaire', amount: 250000, type: 'income', date: '2026-10-28T09:00:00.000Z' },
  { ID: '2', description: 'Loyer', amount: 85000, type: 'expense', date: '2026-10-27T08:00:00.000Z' },
]

const server = setupServer(
  http.get('*/api/transactions', () => {
    return HttpResponse.json(transactions)
  }),
  http.post('*/api/transactions', async ({ request }) => {
    const body = (await request.json()) as object
    return HttpResponse.json({ ID: '3', ...body }, { status: 201 })
  }),
  http.delete('*/api/transactions/:id', () => {
    return new HttpResponse(null, { status: 200 })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('App', () => {
  it('affiche la liste des transactions', async () => {
    render(<App />)

    expect(await screen.findByText('Salaire')).toBeInTheDocument()
    expect(screen.getByText('Loyer')).toBeInTheDocument()
  })

  it('affiche le solde', async () => {
    render(<App />)
    await screen.findByText('Salaire')

    expect(screen.getByTestId('balance').textContent).toContain('650,00')
  })

  it('ajoute une transaction', async () => {
    render(<App />)
    await screen.findByText('Salaire')

    await userEvent.type(screen.getByLabelText('Description'), 'Cinema')
    await userEvent.type(screen.getByLabelText('Montant'), '10')
    await userEvent.click(screen.getByText('Ajouter'))

    expect(await screen.findByText('Cinema')).toBeInTheDocument()
  })

  it('supprime une transaction', async () => {
    render(<App />)
    await screen.findByText('Loyer')

    await userEvent.click(screen.getByLabelText('Supprimer Loyer'))

    await waitFor(() => {
      expect(screen.queryByText('Loyer')).toBeNull()
    })
    expect(screen.getByText('Salaire')).toBeInTheDocument()
  })

  it('affiche une erreur si l api plante', async () => {
    server.use(
      http.get('*/api/transactions', () => {
        return HttpResponse.json({ statusCode: 401, message: 'Invalid token' }, { status: 401 })
      }),
    )
    render(<App />)

    expect(await screen.findByText('Erreur : Invalid token')).toBeInTheDocument()
  })

  it('affiche un message quand il n y a pas de transaction', async () => {
    server.use(
      http.get('*/api/transactions', () => {
        return HttpResponse.json([])
      }),
    )
    render(<App />)

    expect(await screen.findByText('Aucune transaction.')).toBeInTheDocument()
  })
})
