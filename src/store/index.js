import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import rootReducer from './rootReducer';

const store = configureStore({
	reducer: {
		...rootReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	//devTools: false,
	middleware: (getDefaultMiddleware) => {
		const middleware = [...getDefaultMiddleware(), apiSlice.middleware];
		return middleware;
	},
});

export default store;
