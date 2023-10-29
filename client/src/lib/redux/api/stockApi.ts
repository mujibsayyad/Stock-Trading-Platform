import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  }),
  // prepareHeaders: (headers, { getState }) => {
  //   // If using Redux for storing the token
  //   // const token = selectToken(getState());
  //   return headers;
  // },
  tagTypes: ['stocks'],
  endpoints: (builder) => ({
    // get stock data
    getStockData: builder.query({
      query: ({ market, symbol }) => ({
        url: `/intraday/${symbol}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['stocks'],
    }),
    // get stock data
    getOnSelecteStockData: builder.query({
      query: ({symbol, day}) => ({
        url: `/historical/${symbol}/${day}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['stocks'],
    }),
  }),
});

export const { useGetStockDataQuery, useLazyGetOnSelecteStockDataQuery } =
  stockApi;
