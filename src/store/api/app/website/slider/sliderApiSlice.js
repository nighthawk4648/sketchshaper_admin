import { apiSlice } from '@/store/api/apiSlice';

export const sliderApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getSliders: builder.query({
			query: () => 'sliders',
			providesTags: ['slider'],
		}),

		getSlidersByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`sliders/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['slider'],
		}),

		getSliderById: builder.query({
			query: (id) => `sliders/${id}`,
			providesTags: ['slider'],
		}),

		createSlider: builder.mutation({
			query: (data) => ({
				url: 'sliders',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['slider'],
		}),

		updateSlider: builder.mutation({
			query: ({ id, data }) => ({
				url: `sliders/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['slider'],
		}),

		

		deleteSlider: builder.mutation({
			query: (id) => ({
				url: `sliders/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['slider'],
		}),
	}),
});

export const {
	useGetSlidersQuery,
	useGetSlidersByPaginationQuery,
	useGetSliderByIdQuery,
	useCreateSliderMutation,
	useUpdateSliderMutation,
	useDeleteSliderMutation,
} = sliderApi;
