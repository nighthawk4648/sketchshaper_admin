import { apiSlice } from '@/store/api/apiSlice';

export const subCategoryApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getSubCategories: builder.query({
			query: () => 'sub-categories',
			providesTags: ['subCategories'],
		}),

		getSubCategoriesByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`sub-categories/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['subCategories'],
		}),

		getSubCategoryById: builder.query({
			query: (id) => `sub-categories/${id}`,
			providesTags: ['subCategories'],
		}),

		createSubCategory: builder.mutation({
			query: (data) => ({
				url: 'sub-categories',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['subCategories'],
		}),

		updateSubCategory: builder.mutation({
			query: ({ id, data }) => ({
				url: `sub-categories/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['subCategories'],
		}),

	

		deleteSubCategory: builder.mutation({
			query: (id) => ({
				url: `sub-categories/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['subCategories'],
		}),
	}),
});

export const {
    useCreateSubCategoryMutation,
    useDeleteSubCategoryMutation,
    useGetSubCategoriesByPaginationQuery,
    useGetSubCategoriesQuery,
    useGetSubCategoryByIdQuery,
    useUpdateSubCategoryMutation
   
	
} = subCategoryApiSlice;
