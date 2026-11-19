import { describe, expect, it } from 'vitest'
import { balance, formatCents, signedAmount, toCents } from '../../src/lib/money'

describe('toCents', () => {
  it('convertit un nombre entier', () => {
    expect(toCents('12')).toBe(1200)
  })

  it('accepte la virgule', () => {
    expect(toCents('12,5')).toBe(1250)
  })

  it('accepte le point', () => {
    expect(toCents('12.34')).toBe(1234)
  })

  it('retourne null si le champ est vide', () => {
    expect(toCents('')).toBe(null)
  })

  it('retourne null si ce n est pas un nombre', () => {
    expect(toCents('abc')).toBe(null)
  })

  it('retourne null si le montant est negatif ou nul', () => {
    expect(toCents('0')).toBe(null)
    expect(toCents('-5')).toBe(null)
  })
})

describe('formatCents', () => {
  it('affiche le montant en euros', () => {
    const result = formatCents(1599)
    expect(result).toContain('15,99')
    expect(result).toContain('€')
  })
})

describe('signedAmount', () => {
  it('une depense est negative', () => {
    expect(signedAmount({ amount: 1200, type: 'expense' })).toBe(-1200)
  })

  it('un revenu est positif', () => {
    expect(signedAmount({ amount: 5000, type: 'income' })).toBe(5000)
  })
})

describe('balance', () => {
  it('calcule le solde', () => {
    const transactions = [
      { amount: 10000, type: 'income' as const },
      { amount: 3000, type: 'expense' as const },
    ]
    expect(balance(transactions)).toBe(7000)
  })

  it('vaut 0 sans transaction', () => {
    expect(balance([])).toBe(0)
  })
})
