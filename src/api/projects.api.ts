import { baseApi } from './base.api'
import {
  ProjectsListResponseSchema,
  ProjectResponseSchema,
  type ProjectsListResponse,
  type ProjectResponse,
  type CreateProjectBody,
  type UpdateProjectBody,
} from '../schemas/project.schemas'

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<ProjectsListResponse, void>({
      query: () => '/projects',
      transformResponse: (raw) => ProjectsListResponseSchema.parse(raw),
      providesTags: ['Project'],
    }),

    createProject: build.mutation<ProjectResponse, CreateProjectBody>({
      query: (body) => ({ url: '/projects', method: 'POST', body }),
      transformResponse: (raw) => ProjectResponseSchema.parse(raw),
      invalidatesTags: ['Project'],
    }),

    updateProject: build.mutation<ProjectResponse, { id: string } & UpdateProjectBody>({
      query: ({ id, ...body }) => ({ url: `/projects/${id}`, method: 'PATCH', body }),
      transformResponse: (raw) => ProjectResponseSchema.parse(raw),
      invalidatesTags: ['Project'],
    }),

    deleteProject: build.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Project'],
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi
