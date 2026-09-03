import { apiSlice } from '@/store/api/apiSlice';

export const applicationAPi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getApplications: builder.query({
			query: () => 'application',
			providesTags: ['Application'],
		}),

		createApplication: builder.mutation({
			query: (data) => ({
				url: 'application',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Application'],
		}),
	}),
});

export const {
	useGetApplicationsQuery,
	useCreateApplicationMutation
} =
	applicationAPi;
