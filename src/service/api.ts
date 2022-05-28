import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${window.location.origin}/api/`,
  }),
  endpoints: (build) => ({}),
});
