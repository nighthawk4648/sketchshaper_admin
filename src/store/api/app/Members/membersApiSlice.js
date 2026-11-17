import { apiSlice } from "@/store/api/apiSlice";

export const membersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query({
      query: ({ page = 1, limit = 20, search = "", filter = "all" } = {}) =>
        `members?page=${page}&limit=${limit}&filter=${filter}&search=${encodeURIComponent(search)}`,
      providesTags: ["members"],
    }),
    getMemberStats: builder.query({
      query: () => "members/stats",
      providesTags: ["members"],
    }),
    getMember: builder.query({
      query: (id) => `members/${id}`,
      providesTags: ["members"],
    }),
    getMemberPayments: builder.query({
      query: (id) => `members/${id}/payments`,
      providesTags: ["memberPayments"],
    }),
    addMemberPayment: builder.mutation({
      query: ({ id, ...body }) => ({ url: `members/${id}/payments`, method: "POST", body }),
      invalidatesTags: ["memberPayments"],
    }),
    deleteMemberPayment: builder.mutation({
      query: ({ id, paymentId }) => ({ url: `members/${id}/payments/${paymentId}`, method: "DELETE" }),
      invalidatesTags: ["memberPayments"],
    }),
    setMemberAccess: builder.mutation({
      query: ({ id, ...body }) => ({ url: `members/${id}/access`, method: "PATCH", body }),
      invalidatesTags: ["members"],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useGetMemberStatsQuery,
  useGetMemberQuery,
  useSetMemberAccessMutation,
  useGetMemberPaymentsQuery,
  useAddMemberPaymentMutation,
  useDeleteMemberPaymentMutation,
} = membersApiSlice;
