

import { apiSlice } from '@/store/api/apiSlice';

export const innovativeAPiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getInnovative: builder.query({
			query: () => 'innovative',
			providesTags: ['innovative'],
		}),

		getInnovativeByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`innovative/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['innovative'],
		}),

		getInnovativeById: builder.query({
			query: (id) => `innovative/${id}`,
			providesTags: ['innovative'],
		}),

		createInnovative: builder.mutation({
			query: (data) => ({
				url: 'innovative',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['innovative'],
		}),

		updateInnovative: builder.mutation({
			query: ({ id, data }) => ({
				url: `innovative/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['innovative'],
		}),

		

		deleteInnovative: builder.mutation({
			query: (id) => ({
				url: `innovative/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['innovative'],
		}),
	}),
});

export const {
	useCreateInnovativeMutation,
    useDeleteInnovativeMutation,
    useGetInnovativeByIdQuery,
    useGetInnovativeByPaginationQuery,
    useGetInnovativeQuery,
    useUpdateInnovativeMutation
} = innovativeAPiSlice;
