import { isJson } from '@/utils/isJson';
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
const parsed = isJson(user) ? JSON.parse(user) : null;
// Support both flat user payload and legacy { auth: payload } wrapper
const storedUser = parsed?.auth ? parsed.auth : parsed;
const token = Cookies.get('token') || storedUser?.token || '';

const initialStateSchema = {
	auth: {
		id: '',
		email: '',
		role: {
			id: '',
			name: '',
		},
		token: '',
	},
	isAuth: false,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState:
		token && storedUser
			? {
					auth: {
						...storedUser,
						token: token || storedUser.token || '',
					},
					isAuth: true,
			  }
			: initialStateSchema,
	reducers: {
		setUser: (state, action) => {
			const payload = action.payload || {};
			if (payload.token) {
				Cookies.set('token', payload.token, {
					expires: 1,
				});
			}

			localStorage.setItem('user', JSON.stringify(payload));

			state.auth = payload;
			state.isAuth = true;
		},

		logOut: (state) => {
			Cookies.remove('token');
			localStorage.removeItem('user');

			state.auth = initialStateSchema.auth;
			state.isAuth = false;
		},
	},
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;
