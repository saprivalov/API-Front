import { test, expect } from '@playwright/test'

const BASE = '/API-Front/'
const USER = process.env.PLAYWRIGHT_USER ?? ''
const PASSWORD = process.env.PLAYWRIGHT_PASSWORD ?? ''

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE)
  })

  test('shows login page by default', async ({ page }) => {
    await expect(page.getByText('The Orchestra of Agents')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  test('shows error on wrong password', async ({ page }) => {
    await page.getByLabel('Email').fill('invalid@example.com')
    await page.getByLabel('Password').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In' }).click()
    await expect(page.locator('.ant-alert-error')).toBeVisible({ timeout: 10000 })
  })

  test('redirects to dashboard after successful login', async ({ page }) => {
    test.skip(!USER || !PASSWORD, 'PLAYWRIGHT_USER / PLAYWRIGHT_PASSWORD not set')

    await page.getByLabel('Email').fill(USER)
    await page.getByLabel('Password').fill(PASSWORD)
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page.getByRole('tab', { name: 'Agent Tasks' })).toBeVisible({ timeout: 15000 })
  })
})
