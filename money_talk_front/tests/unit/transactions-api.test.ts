import { afterEach, describe, expect, it, vi } from 'vitest'
import { createTransaction, deleteTransaction, listTransactions } from '../../src/api/transactions'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('api transactions', () => {
  it('listTransactions appelle GET /api/transactions', async () => {
    const fakeData = [{ ID: '1', description: 'Courses', amount: 1200, type: 'expense' }]
    const fakeFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify(fakeData)))
    vi.stubGlobal('fetch', fakeFetch)

    const result = await listTransactions()

    expect(result).toEqual(fakeData)
    expect(fakeFetch.mock.calls[0][0]).toBe('http://localhost:3000/api/transactions')
  })

  it('createTransaction envoie un POST avec la transaction', async () => {
    const fakeFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ID: '1' }), { status: 201 }))
    vi.stubGlobal('fetch', fakeFetch)

    await createTransaction({ description: 'Courses', amount: 1200, type: 'expense' })

    const options = fakeFetch.mock.calls[0][1]
    expect(options.method).toBe('POST')
    expect(options.body).toBe('{"description":"Courses","amount":1200,"type":"expense"}')
  })

  it('deleteTransaction envoie un DELETE', async () => {
    const fakeFetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fakeFetch)

    await deleteTransaction('123')

    expect(fakeFetch.mock.calls[0][0]).toBe('http://localhost:3000/api/transactions/123')
    expect(fakeFetch.mock.calls[0][1].method).toBe('DELETE')
  })

  it('renvoie une erreur si l api repond 404', async () => {
    const body = JSON.stringify({ statusCode: 404, message: 'Transaction not found' })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(body, { status: 404 })))

    await expect(deleteTransaction('123')).rejects.toThrow('Transaction not found')
  })
})
