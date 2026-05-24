import { z } from 'zod'

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  repoPath: z.string(),
  baseBranch: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const ProjectsListResponseSchema = z.object({ data: z.array(ProjectSchema) })
export const ProjectResponseSchema = z.object({ data: ProjectSchema })

export const CreateProjectBodySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  repoPath: z.string().min(1),
  baseBranch: z.string().min(1),
})

export const UpdateProjectBodySchema = CreateProjectBodySchema.partial()

export type Project = z.infer<typeof ProjectSchema>
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>
export type ProjectResponse = z.infer<typeof ProjectResponseSchema>
export type CreateProjectBody = z.infer<typeof CreateProjectBodySchema>
export type UpdateProjectBody = z.infer<typeof UpdateProjectBodySchema>
