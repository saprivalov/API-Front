import { baseApi } from './base.api'
import {
  SubmissionsListResponseSchema,
  SubmissionResponseSchema,
  type SubmissionsListResponse,
  type SubmissionResponse,
  type CreateSubmissionBody,
} from '../schemas/submission.schemas'

export const submissionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSubmissions: build.query<SubmissionsListResponse, void>({
      query: () => '/submissions',
      transformResponse: (raw) => SubmissionsListResponseSchema.parse(raw),
      providesTags: ['Submission'],
    }),

    createSubmission: build.mutation<SubmissionResponse, CreateSubmissionBody>({
      query: (body) => ({
        url: '/submissions',
        method: 'POST',
        body,
      }),
      transformResponse: (raw) => SubmissionResponseSchema.parse(raw),
      invalidatesTags: ['Submission'],
    }),
  }),
})

export const { useGetSubmissionsQuery, useCreateSubmissionMutation } = submissionsApi
