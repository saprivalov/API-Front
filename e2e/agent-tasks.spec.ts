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

test.describe('Agent Tasks tab', () => {
  test.skip(!USER || !PASSWORD, 'PLAYWRIGHT_USER / PLAYWRIGHT_PASSWORD not set')

  test.beforeEach(async ({ page }) => {
    await login(page)
    await page.getByRole('tab', { name: 'Agent Tasks' }).click()
  })

  test('filter by status works', async ({ page }) => {
    const filterSelect = page.getByPlaceholder('Filter by status')
    await filterSelect.click()
    await page.getByTitle('Pending').click()
    await expect(filterSelect).toContainText('Pending')
    // Confirm filter cleared with the clear button
    await page.locator('.ant-select-clear').click()
    await expect(filterSelect).not.toContainText('Pending')
  })

  test('clicking Eye button opens detail modal', async ({ page }) => {
    // Wait for the table to load
    await page.waitForSelector('.ant-table-row', { timeout: 10000 }).catch(() => null)

    const rows = page.locator('.ant-table-row')
    const rowCount = await rows.count()
    if (rowCount === 0) {
      test.skip(true, 'No agent tasks in the table to test Eye button')
      return
    }

    const eyeButton = rows.first().locator('button').filter({ has: page.locator('[aria-label="eye"]') })
    await eyeButton.click()

    await expect(page.locator('.ant-modal')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('.ant-descriptions')).toBeVisible()

    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.locator('.ant-modal')).not.toBeVisible()
  })

  test('mentor can open Create Task modal and fill the form', async ({ page }) => {
    const createButton = page.getByRole('button', { name: 'Create Task' })
    if (!(await createButton.isVisible())) {
      test.skip(true, 'Create Task button only visible to mentors')
      return
    }

    await createButton.click()

    const modal = page.locator('.ant-modal')
    await expect(modal).toBeVisible({ timeout: 5000 })
    await expect(modal.getByText('Create Agent Task')).toBeVisible()

    await modal.getByLabel('Title').fill('E2E test task')
    await modal.getByLabel('Description').fill('Created by Playwright test')

    await expect(modal.getByLabel('Title')).toHaveValue('E2E test task')

    await modal.getByRole('button', { name: 'Cancel' }).click()
    await expect(modal).not.toBeVisible()
  })
})
