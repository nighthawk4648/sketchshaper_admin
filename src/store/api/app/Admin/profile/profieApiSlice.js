import { apiSlice } from "@/store/api/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({


    getAdminById: builder.query({
      query: (id) => `/admin/${id}`,
      providesTags: ['Admin'],
    }),
  }),
});
export const {
  useGetAdminByIdQuery,

} = adminApi;