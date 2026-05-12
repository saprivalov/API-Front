import { baseApi } from './base.api'
import {
  AgentTasksListResponseSchema,
  AgentTaskResponseSchema,
  type AgentTasksListResponse,
  type AgentTaskResponse,
  type GetAgentTasksQuery,
  type CreateAgentTaskBody,
} from '../schemas/agent-task.schemas'

export const agentTasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAgentTasks: build.query<AgentTasksListResponse, GetAgentTasksQuery | void>({
      query: (params) => ({ url: '/agent-tasks', params: params ?? undefined }),
      transformResponse: (raw) => AgentTasksListResponseSchema.parse(raw),
      providesTags: ['AgentTask'],
    }),

    getAgentTask: build.query<AgentTaskResponse, string>({
      query: (id) => `/agent-tasks/${id}`,
      transformResponse: (raw) => AgentTaskResponseSchema.parse(raw),
      providesTags: (_result, _error, id) => [{ type: 'AgentTask', id }],
    }),

    createAgentTask: build.mutation<AgentTaskResponse, CreateAgentTaskBody>({
      query: (body) => ({ url: '/agent-tasks', method: 'POST', body }),
      transformResponse: (raw) => AgentTaskResponseSchema.parse(raw),
      invalidatesTags: ['AgentTask'],
    }),

    deleteAgentTask: build.mutation<void, string>({
      query: (id) => ({ url: `/agent-tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['AgentTask'],
    }),
  }),
})

export const {
  useGetAgentTasksQuery,
  useGetAgentTaskQuery,
  useCreateAgentTaskMutation,
  useDeleteAgentTaskMutation,
} = agentTasksApi
