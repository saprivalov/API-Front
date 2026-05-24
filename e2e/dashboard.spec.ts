import { test, expect } from '@playwright/test'

const BASE = '/API-Front/'
const USER = process.env.PLAYWRIGHT_USER ?? ''
const PASSWORD = process.env.PLAYWRIGHT_PASSWORD ?? ''

async function login(page: import('@playwright/test').Page) {
  await page.goto(BASE)
  await page.getByLabel('Email').fill(USER)
  await page.getByLabel('Password').fill(PASSWORD)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page.getByRole('tab', { name: 'Agent Tasks' })).toBeVisible({ timeout: 15000 })
}

test.describe('Dashboard tabs', () => {
  test.skip(!USER || !PASSWORD, 'PLAYWRIGHT_USER / PLAYWRIGHT_PASSWORD not set')

  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('Agent Tasks tab is visible', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Agent Tasks' })).toBeVisible()
  })

  test('navigates to Agent Tasks tab', async ({ page }) => {
    await page.getByRole('tab', { name: 'Agent Tasks' }).click()
    await expect(page.getByPlaceholder('Filter by status')).toBeVisible()
  })

  test('API Keys tab visible for mentor and navigates to it', async ({ page }) => {
    const apiKeysTab = page.getByRole('tab', { name: 'API Keys' })
    if (await apiKeysTab.isVisible()) {
      await apiKeysTab.click()
      await expect(page.getByText('API Keys')).toBeVisible()
    } else {
      test.skip(true, 'API Keys tab only visible to mentors')
    }
  })
})
