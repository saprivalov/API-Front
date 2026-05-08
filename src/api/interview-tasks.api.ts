import { baseApi } from './base.api'
import {
  InterviewTasksListResponseSchema,
  InterviewTaskResponseSchema,
  type InterviewTasksListResponse,
  type InterviewTaskResponse,
  type GetTasksQuery,
  type CreateInterviewTaskBody,
  type UpdateInterviewTaskBody,
} from '../schemas/interview-task.schemas'

export const interviewTasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getInterviewTasks: build.query<InterviewTasksListResponse, GetTasksQuery | void>({
      query: (params) => ({
        url: '/interview-tasks',
        params: params ?? undefined,
      }),
      transformResponse: (raw) => InterviewTasksListResponseSchema.parse(raw),
      providesTags: ['InterviewTask'],
    }),

    getInterviewTask: build.query<InterviewTaskResponse, string>({
      query: (id) => `/interview-tasks/${id}`,
      transformResponse: (raw) => InterviewTaskResponseSchema.parse(raw),
      providesTags: (_result, _error, id) => [{ type: 'InterviewTask', id }],
    }),

    createInterviewTask: build.mutation<InterviewTaskResponse, CreateInterviewTaskBody>({
      query: (body) => ({
        url: '/interview-tasks',
        method: 'POST',
        body,
      }),
      transformResponse: (raw) => InterviewTaskResponseSchema.parse(raw),
      invalidatesTags: ['InterviewTask'],
    }),

    updateInterviewTask: build.mutation<InterviewTaskResponse, { id: string } & UpdateInterviewTaskBody>({
      query: ({ id, ...body }) => ({
        url: `/interview-tasks/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (raw) => InterviewTaskResponseSchema.parse(raw),
      invalidatesTags: (_result, _error, { id }) => ['InterviewTask', { type: 'InterviewTask', id }],
    }),

    deleteInterviewTask: build.mutation<void, string>({
      query: (id) => ({
        url: `/interview-tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['InterviewTask'],
    }),
  }),
})

export const {
  useGetInterviewTasksQuery,
  useGetInterviewTaskQuery,
  useCreateInterviewTaskMutation,
  useUpdateInterviewTaskMutation,
  useDeleteInterviewTaskMutation,
} = interviewTasksApi
