import { baseApi } from './base.api'
import {
  UsersListResponseSchema,
  UserResponseSchema,
  MeResponseSchema,
  type UsersListResponse,
  type UserResponse,
  type CreateUserBody,
  type MeResponse,
  type UpdateMeBody,
} from '../schemas/user.schemas'

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersListResponse, void>({
      query: () => '/users',
      transformResponse: (raw) => UsersListResponseSchema.parse(raw),
      providesTags: ['User'],
    }),

    getMe: build.query<MeResponse, void>({
      query: () => '/users/me',
      transformResponse: (raw) => MeResponseSchema.parse(raw),
      providesTags: [{ type: 'User', id: 'ME' }],
    }),

    createUser: build.mutation<UserResponse, CreateUserBody>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      transformResponse: (raw) => UserResponseSchema.parse(raw),
      invalidatesTags: ['User'],
    }),

    updateMe: build.mutation<MeResponse, UpdateMeBody>({
      query: (body) => ({
        url: '/users/me',
        method: 'PATCH',
        body,
      }),
      transformResponse: (raw) => MeResponseSchema.parse(raw),
      invalidatesTags: [{ type: 'User', id: 'ME' }, 'User'],
    }),

    patchUserRole: build.mutation<UserResponse, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      transformResponse: (raw) => UserResponseSchema.parse(raw),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetMeQuery,
  useCreateUserMutation,
  useUpdateMeMutation,
  usePatchUserRoleMutation,
} = usersApi
