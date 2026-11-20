import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import DcTrainingTab from './DcTrainingTab'
import { STORAGE_KEY, trainingModules } from './dcTraining.data'

const total = trainingModules.reduce((sum, m) => sum + m.tasks.length, 0)

describe('DcTrainingTab', () => {
  beforeEach(() => localStorage.clear())

  it('renders all modules with nothing done', () => {
    render(<DcTrainingTab />)
    for (const m of trainingModules) expect(screen.getByText(m.title)).toBeInTheDocument()
    expect(screen.getByText(`0 of ${total} tasks done`)).toBeInTheDocument()
  })

  it('marks a task done and persists it', async () => {
    render(<DcTrainingTab />)
    const first = trainingModules[0].tasks[0]
    await userEvent.click(screen.getByRole('checkbox', { name: first.title }))
    expect(screen.getByText(`1 of ${total} tasks done`)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([first.id])
  })

  it('restores progress from storage and ignores corrupt data', () => {
    localStorage.setItem(STORAGE_KEY, 'not json')
    const { unmount } = render(<DcTrainingTab />)
    expect(screen.getByText(`0 of ${total} tasks done`)).toBeInTheDocument()
    unmount()

    const first = trainingModules[0].tasks[0]
    localStorage.setItem(STORAGE_KEY, JSON.stringify([first.id]))
    render(<DcTrainingTab />)
    expect(screen.getByRole('checkbox', { name: first.title })).toBeChecked()
  })
})
