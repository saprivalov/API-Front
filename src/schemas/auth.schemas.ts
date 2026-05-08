import { z } from 'zod'

export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export const AuthResponseSchema = z.object({
  data: TokensSchema,
})

export const LoginBodySchema = z.object({
  email: z.string().email(),
})

export const RefreshBodySchema = z.object({
  refreshToken: z.string().min(1),
})

export type Tokens = z.infer<typeof TokensSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type LoginBody = z.infer<typeof LoginBodySchema>
export type RefreshBody = z.infer<typeof RefreshBodySchema>
