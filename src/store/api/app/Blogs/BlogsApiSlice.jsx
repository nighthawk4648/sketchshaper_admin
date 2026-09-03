import { apiSlice } from '@/store/api/apiSlice';

export const blogsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getBlogs: builder.query({
			query: () => 'blogs',
			providesTags: ['blogs'],
		}),

		getBlogsByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`blogs/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['blogs'],
		}),

		getBlogsById: builder.query({
			query: (id) => `blogs/${id}`,
			providesTags: ['blogs'],
		}),

		createBlogs: builder.mutation({
			query: (data) => ({
				url: 'blogs',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['blogs'],
		}),

		updateBlogs: builder.mutation({
			query: ({ id, data }) => ({
				url: `blogs/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['blogs'],
		}),

		

		deleteBlogs: builder.mutation({
			query: (id) => ({
				url: `blogs/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['blogs'],
		}),
	}),
});

export const {
	useCreateBlogsMutation,
	useDeleteBlogsMutation,
    useGetBlogsByPaginationQuery,
    useGetBlogsQuery,
    useGetBlogsByIdQuery,
    useUpdateBlogsMutation,
} = blogsApiSlice;
