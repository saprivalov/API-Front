import { z } from 'zod'

export const SubmissionStatusSchema = z.enum(['pending', 'reviewed'])

export const SubmissionSchema = z.object({
  id: z.string().uuid(),
  taskId: z.string().uuid(),
  userId: z.string().uuid(),
  status: SubmissionStatusSchema,
  score: z.number().int().min(0).max(100).nullable(),
  task: z.object({
    id: z.string().uuid(),
    title: z.string(),
    level: z.string(),
  }).optional().nullable(),
  user: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string(),
  }).optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const SubmissionsListResponseSchema = z.object({
  data: z.array(SubmissionSchema),
})

export const SubmissionResponseSchema = z.object({
  data: SubmissionSchema,
})

export const CreateSubmissionBodySchema = z.object({
  taskId: z.string().min(1),
  userId: z.string().min(1),
  status: SubmissionStatusSchema.optional(),
  score: z.number().int().min(0).max(100).optional(),
})

export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>
export type Submission = z.infer<typeof SubmissionSchema>
export type SubmissionsListResponse = z.infer<typeof SubmissionsListResponseSchema>
export type SubmissionResponse = z.infer<typeof SubmissionResponseSchema>
export type CreateSubmissionBody = z.infer<typeof CreateSubmissionBodySchema>
