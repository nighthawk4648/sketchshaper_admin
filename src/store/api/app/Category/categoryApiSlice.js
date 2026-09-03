import { apiSlice } from '@/store/api/apiSlice';

export const categoryApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCategories: builder.query({
			query: () => 'categories',
			providesTags: ['category'],
		}),

		getCategoriesByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`categories/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['category'],
		}),

		getCategoryById: builder.query({
			query: (id) => `categories/${id}`,
			providesTags: ['category'],
		}),

		createCategory: builder.mutation({
			query: (data) => ({
				url: 'categories',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['category'],
		}),

		updateCategory: builder.mutation({
			query: ({ id, data }) => ({
				url: `categories/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['category'],
		}),

	

		deleteCategory: builder.mutation({
			query: (id) => ({
				url: `categories/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['category'],
		}),
	}),
});

export const {
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useGetCategoriesByPaginationQuery,
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useUpdateCategoryMutation
	
} = categoryApiSlice;
