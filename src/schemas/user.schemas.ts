import { z } from 'zod'

export const RoleSchema = z.enum(['candidate', 'mentor'])

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: RoleSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  _count: z
    .object({
      createdTasks: z.number(),
      submissions: z.number(),
    })
    .optional(),
})

export const UsersListResponseSchema = z.object({
  data: z.array(UserSchema),
})

export const UserResponseSchema = z.object({
  data: UserSchema,
})

export const CreateUserBodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: RoleSchema.optional().default('candidate'),
})

export type Role = z.infer<typeof RoleSchema>
export type User = z.infer<typeof UserSchema>
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
export type CreateUserBody = z.infer<typeof CreateUserBodySchema>
