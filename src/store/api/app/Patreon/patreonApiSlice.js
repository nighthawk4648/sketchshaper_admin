import { apiSlice } from "@/store/api/apiSlice";

export const patreonApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all Patreon users
    getPatreonUsers: builder.query({
      query: ({
        page = 1,
        limit = 10,
        order = "desc",
        search = "",
        status = "",
      } = {}) =>
        `patreon/users?page=${page}&limit=${limit}&order=${order}&search=${encodeURIComponent(search)}${status ? `&status=${status}` : ""}`,
      providesTags: ["patreon"],
    }),

    // Get single Patreon user
    getPatreonUserById: builder.query({
      query: (id) => `patreon/users/${id}`,
      providesTags: ["patreon"],
    }),

    // Revoke user access
    revokePatreonUser: builder.mutation({
      query: (id) => ({
        url: `patreon/users/${id}/revoke`,
        method: "POST",
      }),
      invalidatesTags: ["patreon"],
    }),
  }),
});

export const {
  useGetPatreonUsersQuery,
  useGetPatreonUserByIdQuery,
  useRevokePatreonUserMutation,
} = patreonApiSlice;
