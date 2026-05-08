import { baseApi } from './base.api'
import {
  UsersListResponseSchema,
  UserResponseSchema,
  type UsersListResponse,
  type UserResponse,
  type CreateUserBody,
} from '../schemas/user.schemas'

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersListResponse, void>({
      query: () => '/users',
      transformResponse: (raw) => UsersListResponseSchema.parse(raw),
      providesTags: ['User'],
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
  }),
})

export const { useGetUsersQuery, useCreateUserMutation } = usersApi
