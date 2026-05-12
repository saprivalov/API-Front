import { describe, it, expect } from 'vitest'
import {
  InterviewTaskSchema,
  TaskLevelSchema,
  InterviewTasksListResponseSchema,
} from './interview-task.schemas'

const ID1 = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
const ID2 = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'
const ID3 = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'
const ID4 = 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'

const baseTask = {
  id: ID1,
  title: 'Explain event loop',
  level: 'junior',
  createdByUserId: ID2,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('TaskLevelSchema', () => {
  it.each(['junior', 'middle', 'senior'])('accepts %s', (level) => {
    expect(TaskLevelSchema.parse(level)).toBe(level)
  })

  it('rejects unknown level', () => {
    expect(() => TaskLevelSchema.parse('expert')).toThrow()
  })
})

describe('InterviewTaskSchema', () => {
  it('parses a minimal task', () => {
    const result = InterviewTaskSchema.parse(baseTask)
    expect(result.level).toBe('junior')
    expect(result.creator).toBeUndefined()
  })

  it('parses taskTags and creator when present', () => {
    const task = {
      ...baseTask,
      creator: { id: ID3, name: 'Bob', email: 'b@test.com' },
      taskTags: [{ tag: { id: ID4, name: 'react' } }],
    }
    const result = InterviewTaskSchema.parse(task)
    expect(result.creator?.name).toBe('Bob')
    expect(result.taskTags?.[0].tag.name).toBe('react')
  })

  it('rejects invalid uuid', () => {
    expect(() => InterviewTaskSchema.parse({ ...baseTask, id: 'bad' })).toThrow()
  })
})

describe('InterviewTasksListResponseSchema', () => {
  it('parses list with pagination meta', () => {
    const raw = { data: [baseTask], meta: { total: 5, page: 1, limit: 10 } }
    const result = InterviewTasksListResponseSchema.parse(raw)
    expect(result.meta.total).toBe(5)
    expect(result.data[0].title).toBe('Explain event loop')
  })
})
