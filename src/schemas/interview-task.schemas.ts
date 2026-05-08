import { z } from 'zod'

export const TaskLevelSchema = z.enum(['junior', 'middle', 'senior'])

export const InterviewTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  level: TaskLevelSchema,
  createdByUserId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
})

export const InterviewTasksListResponseSchema = z.object({
  data: z.array(InterviewTaskSchema),
  meta: PaginationMetaSchema,
})

export const InterviewTaskResponseSchema = z.object({
  data: InterviewTaskSchema,
})

export const GetTasksQuerySchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  level: TaskLevelSchema.optional(),
  search: z.string().min(1).optional(),
  sortBy: z.enum(['createdAt', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

export const CreateInterviewTaskBodySchema = z.object({
  title: z.string().min(5).max(150),
  level: TaskLevelSchema,
  createdByUserId: z.string().min(1),
})

export const UpdateInterviewTaskBodySchema = z.object({
  title: z.string().min(5).max(150).optional(),
  level: TaskLevelSchema.optional(),
})

export type TaskLevel = z.infer<typeof TaskLevelSchema>
export type InterviewTask = z.infer<typeof InterviewTaskSchema>
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
export type InterviewTasksListResponse = z.infer<typeof InterviewTasksListResponseSchema>
export type InterviewTaskResponse = z.infer<typeof InterviewTaskResponseSchema>
export type GetTasksQuery = z.infer<typeof GetTasksQuerySchema>
export type CreateInterviewTaskBody = z.infer<typeof CreateInterviewTaskBodySchema>
export type UpdateInterviewTaskBody = z.infer<typeof UpdateInterviewTaskBodySchema>
