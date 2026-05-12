import { describe, it, expect } from 'vitest'
import {
  AgentTaskSchema,
  AgentTaskStatusSchema,
  AgentTasksListResponseSchema,
} from './agent-task.schemas'

const ID1 = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
const ID2 = 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'
const ID3 = 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'

const baseTask = {
  id: ID1,
  title: 'Summarize logs',
  status: 'pending',
  createdByUserId: ID2,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('AgentTaskStatusSchema', () => {
  it.each(['pending', 'in_progress', 'completed', 'failed'])('accepts %s', (status) => {
    expect(AgentTaskStatusSchema.parse(status)).toBe(status)
  })

  it('rejects unknown status', () => {
    expect(() => AgentTaskStatusSchema.parse('running')).toThrow()
  })
})

describe('AgentTaskSchema', () => {
  it('parses a minimal task', () => {
    const result = AgentTaskSchema.parse(baseTask)
    expect(result.id).toBe(ID1)
    expect(result.status).toBe('pending')
  })

  it('parses optional fields as undefined when absent', () => {
    const result = AgentTaskSchema.parse(baseTask)
    expect(result.description).toBeUndefined()
    expect(result.agentId).toBeUndefined()
    expect(result.result).toBeUndefined()
  })

  it('parses a full task with all fields', () => {
    const full = {
      ...baseTask,
      status: 'completed',
      agentId: 'gpt-4o',
      description: 'Process the queue',
      result: { summary: 'done' },
      metadata: { priority: 1 },
      creator: {
        id: ID3,
        name: 'Alice',
        email: 'alice@test.com',
      },
    }
    const result = AgentTaskSchema.parse(full)
    expect(result.agentId).toBe('gpt-4o')
    expect(result.result).toEqual({ summary: 'done' })
    expect(result.creator?.name).toBe('Alice')
  })

  it('rejects invalid id', () => {
    expect(() => AgentTaskSchema.parse({ ...baseTask, id: 'not-a-uuid' })).toThrow()
  })
})

describe('AgentTasksListResponseSchema', () => {
  it('parses list response with meta', () => {
    const raw = {
      data: [baseTask],
      meta: { total: 1, page: 1, limit: 10 },
    }
    const result = AgentTasksListResponseSchema.parse(raw)
    expect(result.data).toHaveLength(1)
    expect(result.meta.total).toBe(1)
  })
})
