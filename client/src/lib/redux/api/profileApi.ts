import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => `user`,
    }),
  }),
});

export const { useUserProfileQuery } = profileApi;
