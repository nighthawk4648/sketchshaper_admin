import { apiSlice } from '@/store/api/apiSlice';

export const supportedByApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getSupportedby: builder.query({
			query: () => 'supportedby',
			providesTags: ['supportedby'],
		}),

		getSupportedbyByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`supportedby/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['supportedby'],
		}),

		getSupportedbyById: builder.query({
			query: (id) => `supportedby/${id}`,
			providesTags: ['supportedby'],
		}),

		createSupportedby: builder.mutation({
			query: (data) => ({
				url: 'supportedby',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['supportedby'],
		}),

		updateSupportedby: builder.mutation({
			query: ({ id, data }) => ({
				url: `supportedby/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['supportedby'],
		}),

		

		deleteSupportedby: builder.mutation({
			query: (id) => ({
				url: `supportedby/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['supportedby'],
		}),
	}),
});

export const {
	useCreateSupportedbyMutation,
    useDeleteSupportedbyMutation,
    useGetSupportedbyByIdQuery,
    useGetSupportedbyByPaginationQuery,
    useGetSupportedbyQuery,
    useUpdateSupportedbyMutation,
} = supportedByApiSlice;
