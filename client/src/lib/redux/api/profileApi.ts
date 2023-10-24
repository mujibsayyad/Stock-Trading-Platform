import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  }),
  tagTypes: ['auth'],
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => `user`,
    }),

    logout: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: 'POST',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useUserProfileQuery, useLogoutMutation } = profileApi;
