import { baseApi } from './base.api'
import {
  AuthResponseSchema,
  type AuthResponse,
  type LoginBody,
  type RefreshBody,
} from '../schemas/auth.schemas'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginBody>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      transformResponse: (raw) => AuthResponseSchema.parse(raw),
    }),

    refresh: build.mutation<AuthResponse, RefreshBody>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
      transformResponse: (raw) => AuthResponseSchema.parse(raw),
    }),
  }),
})

export const { useLoginMutation, useRefreshMutation } = authApi
