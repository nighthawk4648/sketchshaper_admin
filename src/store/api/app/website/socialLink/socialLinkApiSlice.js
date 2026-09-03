import { apiSlice } from '@/store/api/apiSlice';

export const socialLinkApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getSocialLinks: builder.query({
			query: () => 'social-link',
			providesTags: ['SocialLink'],
		}),

		getSocialLinksByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`social-link/find/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['socialLink'],
		}),

		getSocialLinkById: builder.query({
			query: (id) => `social-link/${id}`,
			providesTags: ['socialLink'],
		}),

		createSocialLink: builder.mutation({
			query: (data) => ({
				url: 'social-link',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['socialLink'],
		}),

		updateSocialLink: builder.mutation({
			query: ({ id, data }) => ({
				url: `social-link/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['socialLink'],
		}),

		updateSocilLinkStatus: builder.mutation({
			query: ({ id, status }) => ({
				url: `social-link/${id}/status?status=${status}`,
				method: 'PUT',
				body: { status },
			}),
			invalidatesTags: ['socialLink'],
		}),

		deleteSocialLink: builder.mutation({
			query: (id) => ({
				url: `social-link/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['socialLink'],
		}),
	}),
});

export const {
	useGetSocialLinksQuery,
	useGetSocialLinksByPaginationQuery,
	useGetSocialLinkByIdQuery,
	useCreateSocialLinkMutation,
	useUpdateSocialLinkMutation,
	useUpdateSocilLinkStatusMutation,
	useDeleteSocialLinkMutation,
} = socialLinkApi;
