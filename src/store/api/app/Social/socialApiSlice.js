import { apiSlice } from '@/store/api/apiSlice';

export const socialApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getSocials: builder.query({
			query: () => 'social',
			providesTags: ['social'],
		}),

		getSocialsByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`social/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['social'],
		}),

		getSocialById: builder.query({
			query: (id) => `social/${id}`,
			providesTags: ['social'],
		}),

		createSocial: builder.mutation({
			query: (data) => ({
				url: 'social',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['social'],
		}),

		updateSocial: builder.mutation({
			query: ({ id, data }) => ({
				url: `social/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['social'],
		}),

		

		deleteSocial: builder.mutation({
			query: (id) => ({
				url: `social/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['social'],
		}),
	}),
});

export const {
    useCreateSocialMutation,
    useDeleteSocialMutation,
    useGetSocialsByPaginationQuery,
    useGetSocialsQuery,
    useGetSocialByIdQuery,
    useUpdateSocialMutation
	
} = socialApiSlice;
