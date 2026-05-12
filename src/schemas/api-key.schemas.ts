import { z } from 'zod'

export const ApiKeySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  agentId: z.string(),
  createdAt: z.string().datetime(),
  key: z.string().optional(), // only returned once on creation
})

export const ApiKeysListResponseSchema = z.object({
  data: z.array(ApiKeySchema),
})

export const ApiKeyResponseSchema = z.object({
  data: ApiKeySchema,
})

export const CreateApiKeyBodySchema = z.object({
  name: z.string().min(1).max(100),
  agentId: z.string().min(1).max(100),
})

export type ApiKey = z.infer<typeof ApiKeySchema>
export type ApiKeysListResponse = z.infer<typeof ApiKeysListResponseSchema>
export type ApiKeyResponse = z.infer<typeof ApiKeyResponseSchema>
export type CreateApiKeyBody = z.infer<typeof CreateApiKeyBodySchema>
