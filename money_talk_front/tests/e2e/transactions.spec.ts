import { expect, test } from '@playwright/test'

test('la page affiche les transactions', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Salaire')).toBeVisible()
  await expect(page.getByText('Loyer')).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(5)
})

test('on peut ajouter une transaction', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('listitem')).toHaveCount(5)

  await page.getByLabel('Description').fill('Cinema')
  await page.getByLabel('Montant').fill('12')
  await page.getByText('Ajouter').click()

  await expect(page.getByRole('listitem')).toHaveCount(6)
})

test('on peut supprimer une transaction', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Loyer')).toBeVisible()

  await page.getByLabel('Supprimer Loyer').click()

  await expect(page.getByText('Loyer')).not.toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(4)
})
