import { baseApi } from './base.api'
import {
  ApiKeysListResponseSchema,
  ApiKeyResponseSchema,
  type ApiKeysListResponse,
  type ApiKeyResponse,
  type CreateApiKeyBody,
} from '../schemas/api-key.schemas'

export const apiKeysApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getApiKeys: build.query<ApiKeysListResponse, void>({
      query: () => '/api-keys',
      transformResponse: (raw) => ApiKeysListResponseSchema.parse(raw),
      providesTags: ['ApiKey'],
    }),

    createApiKey: build.mutation<ApiKeyResponse, CreateApiKeyBody>({
      query: (body) => ({ url: '/api-keys', method: 'POST', body }),
      transformResponse: (raw) => ApiKeyResponseSchema.parse(raw),
      invalidatesTags: ['ApiKey'],
    }),

    deleteApiKey: build.mutation<void, string>({
      query: (id) => ({ url: `/api-keys/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ApiKey'],
    }),
  }),
})

export const { useGetApiKeysQuery, useCreateApiKeyMutation, useDeleteApiKeyMutation } = apiKeysApi
