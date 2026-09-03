import { apiSlice } from '@/store/api/apiSlice';

export const galleryApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getGalleries: builder.query({
			query: () => 'gallery',
			providesTags: ['gallery'],
		}),

		getGalleriesByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`gallery/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['gallery'],
		}),

		getGalleryById: builder.query({
			query: (id) => `gallery/${id}`,
			providesTags: ['gallery'],
		}),

		createGallery: builder.mutation({
			query: (data) => ({
				url: 'gallery',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['gallery'],
		}),

		updateGallery: builder.mutation({
			query: ({ id, data }) => ({
				url: `gallery/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['gallery'],
		}),

		deleteGallery: builder.mutation({
			query: (id) => ({
				url: `gallery/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['gallery'],
		}),
	}),
});

export const {
	useCreateGalleryMutation,
	useDeleteGalleryMutation,
	useGetGalleriesByPaginationQuery,
	useGetGalleriesQuery,
	useGetGalleryByIdQuery,
	useUpdateGalleryMutation,
} = galleryApiSlice;
