import { apiSlice } from "@/store/api/apiSlice";

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContactMessages: builder.query({
      query: ({ page = 1, limit = 20, status = "" }) => ({
        url: "contact",
        params: { page, limit, ...(status ? { status } : {}) },
      }),
      providesTags: ["contactMessages"],
    }),
    updateContactMessageStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `contact/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["contactMessages"],
    }),
    deleteContactMessage: builder.mutation({
      query: (id) => ({
        url: `contact/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contactMessages"],
    }),
  }),
});

export const {
  useGetContactMessagesQuery,
  useUpdateContactMessageStatusMutation,
  useDeleteContactMessageMutation,
} = contactApiSlice;
