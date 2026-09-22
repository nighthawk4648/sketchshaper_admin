import { apiSlice } from "@/store/api/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query({
      query: () => "admins",
      providesTags: ["AdminUser"],
    }),

    getAdminUsersByPagination: builder.query({
      query: ({ page = 1, limit = 10, order = "desc", search = "" } = {}) =>
        `admins?page=${page}&limit=${limit}&order=${order}&search=${search}`,
      providesTags: ["AdminUser"],
    }),

    getAdminUserById: builder.query({
      query: (id) => `admins/${id}`,
      providesTags: ["AdminUser"],
    }),

    createAdminUser: builder.mutation({
      query: (data) => ({
        url: "admins",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminUser"],
    }),

    updateAdminUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `admins/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AdminUser"],
    }),

    deleteAdminUser: builder.mutation({
      query: (id) => ({
        url: `admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUser"],
    }),
  }),
});

export const {
  useGetAdminUsersQuery,
  useGetAdminUsersByPaginationQuery,
  useGetAdminUserByIdQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
} = adminApi;
