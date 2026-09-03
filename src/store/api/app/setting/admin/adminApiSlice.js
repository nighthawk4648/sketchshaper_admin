import { apiSlice } from '@/store/api/apiSlice';

export const adminApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAdminUsers: builder.query({
			query: () => 'admin',
			providesTags: ['AdminUser'],
		}),

		getAdminUsersByPagination: builder.query({
			query: ({ page = 1, limit = 10, order = 'desc', search = '' }) =>
				`admin/find/pages?page=${page}&limit=${limit}&order=${order}&search=${search}`,
			providesTags: ['AdminUser'],
		}),

		getAdminDashboardChart: builder.query({
			query: ({ duration = "this-month" }) =>
				`report/parcel?duration=${duration}`,
			providesTags: ['AdminUser'],
		}),

		getAdminOverview: builder.query({
			query: () => `report/admin/overview`,
			providesTags: ['AdminUser'],
		}),

		getAdminUserById: builder.query({
			query: (id) => `admin/${id}`,
			providesTags: ['AdminUser'],
		}),

		createAdminUser: builder.mutation({
			query: (data) => ({
				url: 'admin',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['AdminUser'],
		}),

		updateAdminUser: builder.mutation({
			query: ({ id, data }) => ({
				url: `admin/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['AdminUser'],
		}),

		deleteAdminUser: builder.mutation({
			query: (id) => ({
				url: `admin/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['AdminUser'],
		}),
	}),
});

export const {
	useGetAdminUsersQuery,
	useGetAdminUsersByPaginationQuery,
	useGetAdminDashboardChartQuery,
	useGetAdminOverviewQuery,
	useGetAdminUserByIdQuery,
	useCreateAdminUserMutation,
	useUpdateAdminUserMutation,
	useDeleteAdminUserMutation,
} = adminApi;
