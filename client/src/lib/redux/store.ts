import {
  configureStore,
  type ThunkAction,
  type Action,
  Store,
} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import { stockApi } from './api/stockApi';

const store: Store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stockApi.middleware),
});

export default store;

/* Types */
export type storeType = typeof store;
export type ReduxState = ReturnType<typeof store.getState>;
export type ReduxDispatch = typeof store.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>;
