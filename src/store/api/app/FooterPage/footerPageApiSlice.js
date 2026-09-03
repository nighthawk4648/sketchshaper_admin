import { apiSlice } from '@/store/api/apiSlice';

export const footerPageApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getFooterPages: builder.query({
			query: () => 'pages',
			providesTags: ['footerPage'],
		}),

		getFooterPagesByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`pages/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['footerPage'],
		}),

		getFooterPageById: builder.query({
			query: (id) => `pages/${id}`,
			providesTags: ['footerPage'],
		}),

		createFooterPage: builder.mutation({
			query: (data) => ({
				url: 'pages',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['footerPage'],
		}),

		updateFooterPage: builder.mutation({
			query: ({ id, data }) => ({
				url: `pages/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['footerPage'],
		}),

	

		deleteFooterPage: builder.mutation({
			query: (id) => ({
				url: `pages/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['footerPage'],
		}),
	}),
});

export const {
    useCreateFooterPageMutation,
    useDeleteFooterPageMutation,
    useGetFooterPagesByPaginationQuery,
    useGetFooterPagesQuery,
    useGetFooterPageByIdQuery,
    useUpdateFooterPageMutation,
    
  
	
} = footerPageApiSlice;
