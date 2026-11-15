import { apiSlice } from '../apiSlice';

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		// registerUser: builder.mutation({
		// 	query: (user) => ({
		// 		url: 'register',
		// 		method: 'POST',
		// 		body: user,
		// 	}),
		// }),
		login: builder.mutation({
			query: (data) => ({
				url: 'admins/login',
				method: 'POST',
				body: data,
			}),
		}),
		// Ends the session on the server and clears its cookie
		logout: builder.mutation({
			query: () => ({
				url: 'admins/logout',
				method: 'POST',
			}),
		}),
	}),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
