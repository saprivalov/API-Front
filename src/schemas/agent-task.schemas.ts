import { z } from 'zod'

export const AgentTaskStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'failed'])

const CreatorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
})

export const AgentTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: AgentTaskStatusSchema,
  agentId: z.string().nullable().optional(),
  createdByUserId: z.string().uuid(),
  creator: CreatorSchema.optional().nullable(),
  result: z.record(z.string(), z.unknown()).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const AgentTasksListResponseSchema = z.object({
  data: z.array(AgentTaskSchema),
  meta: z.object({ total: z.number(), page: z.number(), limit: z.number() }),
})

export const AgentTaskResponseSchema = z.object({
  data: AgentTaskSchema,
})

export const GetAgentTasksQuerySchema = z.object({
  status: AgentTaskStatusSchema.optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
})

export const CreateAgentTaskBodySchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export type AgentTaskStatus = z.infer<typeof AgentTaskStatusSchema>
export type AgentTask = z.infer<typeof AgentTaskSchema>
export type AgentTasksListResponse = z.infer<typeof AgentTasksListResponseSchema>
export type AgentTaskResponse = z.infer<typeof AgentTaskResponseSchema>
export type GetAgentTasksQuery = z.infer<typeof GetAgentTasksQuerySchema>
export type CreateAgentTaskBody = z.infer<typeof CreateAgentTaskBodySchema>
