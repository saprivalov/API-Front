import { z } from 'zod'

export const RoleSchema = z.enum(['candidate', 'mentor'])

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: RoleSchema,
  avatar: z.string().nullable().optional(),
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

/** Current user from GET /users/me (timestamps optional if API omits them). */
export const MeUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: RoleSchema,
  avatar: z.string().nullable().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
})

export const MeResponseSchema = z.object({
  data: MeUserSchema,
})

export type Role = z.infer<typeof RoleSchema>
export type User = z.infer<typeof UserSchema>
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>
export type CreateUserBody = z.infer<typeof CreateUserBodySchema>
export type MeUser = z.infer<typeof MeUserSchema>
export type MeResponse = z.infer<typeof MeResponseSchema>

export type UpdateMeBody = {
  name: string
  avatar: string | null
}
