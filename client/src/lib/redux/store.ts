import {
  configureStore,
  type ThunkAction,
  type Action,
  Store,
} from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import stockSlice from './slices/stockSlice';
import { stockApi } from './api/stockApi';
import { profileApi } from './api/profileApi';

const store: Store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    stock: stockSlice.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stockApi.middleware, profileApi.middleware),
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
