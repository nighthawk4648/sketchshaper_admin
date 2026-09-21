import envConfig from '@/configs/envConfig';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const apiSlice = createApi({
	reducerPath: 'api',
	tagTypes: [
		'Slider',
		'category',
		'subCategories',
		'footerPage',
		'slider',
		'assets',
		'general-about-us',
		'application-settings',
		'social',
		'blogs',
		'supportedby',
		'innovative',
		'patreon',
		'contactMessages'



	],
	baseQuery: fetchBaseQuery({
		baseUrl: envConfig.apiUrl,
		prepareHeaders: (headers, { getState }) => {
			// Try to get token from Redux state first
			const { auth } = getState().auth;
			let token = auth?.token;

			// If not in Redux state, try to get from cookies
			if (!token) {
				token = Cookies.get('token');
			}

			// If token exists, add it to headers
			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
			}
		},
	}),
	endpoints: (builder) => ({}),
});
