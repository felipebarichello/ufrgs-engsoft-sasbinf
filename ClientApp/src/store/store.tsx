import { configureStore } from '@reduxjs/toolkit';
import { sasbinf } from '../api/sasbinfAPI';

export const store = configureStore({
	reducer: { [sasbinf.reducerPath]: sasbinf.reducer },
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(sasbinf.middleware),
});

// https://react-redux.js.org/tutorials/typescript-quick-start#define-root-state-and-dispatch-types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
