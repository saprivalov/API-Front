import { baseApi } from './base.api'
import {
  AuthResponseSchema,
  RegisterResponseSchema,
  type AuthResponse,
  type RegisterResponse,
  type LoginBody,
  type RegisterBody,
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

    register: build.mutation<RegisterResponse, RegisterBody>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      transformResponse: (raw) => RegisterResponseSchema.parse(raw),
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

export const { useLoginMutation, useRegisterMutation, useRefreshMutation } = authApi
