import { isJson } from '@/utils/isJson';
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const user = localStorage.getItem('user');
const storedUser = isJson(user) ? JSON.parse(user) : null;
const token = Cookies.get('token');

const initialStateSchema = {
	auth: {
		"id": "",
		"email": "",
		"role": {
			"id": "",
			"name": "",
		},
		"token": ""
	},
	isAuth: false,
};

export const authSlice = createSlice({
	name: 'auth',
	initialState:
		token && storedUser ? {
			auth: storedUser,
			isAuth: true,
		} : initialStateSchema,
	reducers: {
		setUser: (state, action) => {
			Cookies.set('token', action.payload.token, {
				expires: 1,
			});


			localStorage.setItem(
				'user',
				JSON.stringify({
					auth: action.payload,
				})
			);

			state.auth = action.payload;
			state.isAuth = true;
		},

		logOut: (state, action) => {
			Cookies.remove('token');
			localStorage.removeItem('user');

			state.auth = initialStateSchema.auth;
			state.isAuth = false;
		},
	},
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;
