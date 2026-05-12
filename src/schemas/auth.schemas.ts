import { z } from 'zod'

export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const PublicUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.enum(['candidate', 'mentor']),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const AuthResponseSchema = z.object({
  data: TokensSchema,
})

export const RegisterResponseSchema = z.object({
  data: TokensSchema.extend({
    user: PublicUserSchema,
  }),
})

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const RegisterBodySchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Za-z]/, 'Must include a letter')
    .regex(/[0-9]/, 'Must include a digit'),
  name: z.string().min(2, 'At least 2 characters'),
  role: z.enum(['candidate', 'mentor']),
})

export const RefreshBodySchema = z.object({
  refreshToken: z.string().min(1),
})

export type Tokens = z.infer<typeof TokensSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
export type LoginBody = z.infer<typeof LoginBodySchema>
export type RegisterBody = z.infer<typeof RegisterBodySchema>
export type RefreshBody = z.infer<typeof RefreshBodySchema>
