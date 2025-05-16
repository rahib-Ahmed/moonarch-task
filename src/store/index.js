import { configureStore } from '@reduxjs/toolkit';
import { rootAPI } from './api/rootApi';
import filterReducers from './slices/filterSlice';

export const store = configureStore({
	reducer: {
		[rootAPI.reducerPath]: rootAPI.reducer,
		globalFilter: filterReducers,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(rootAPI.middleware),
	devTools: false,
});

export default store;
