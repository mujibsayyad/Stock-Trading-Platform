import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const stockApi = createApi({
  reducerPath: 'stockApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  // prepareHeaders: (headers, { getState }) => {
  //   // If using Redux for storing the token
  //   // const token = selectToken(getState());
  //   return headers;
  // },
  tagTypes: ['stocks'],
  endpoints: (builder) => ({
    // search stock
    searchStock: builder.query({
      query: (symbol) => ({
        url: `/stockdata/search?symbol=${symbol}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['stocks'],
    }),

    // get stock data
    getStockData: builder.query({
      query: ({ market, symbol }) => ({
        url: `/intraday/${symbol}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['stocks'],
    }),
  }),
});

export const { useSearchStockQuery, useGetStockDataQuery } = stockApi;
