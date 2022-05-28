import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type HueItemDetails = {
  id: string;
  internalipaddress: string;
  port: number;
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${window.location.origin}/api/`,
  }),
  endpoints: (build) => ({
    getHueItems: build.query<HueItemDetails[], void>({
      query: () => `https://discovery.meethue.com/`,
    }),
  }),
});

export const { useGetHueItemsQuery } = api;

export const useGetBridgeIP = () => {
  return useGetHueItemsQuery(undefined, {
    selectFromResult: ({ data, isFetching, isError, isUninitialized }) => {
      return {
        bridgeIp: data?.[0]?.internalipaddress,
        isFetching: isFetching || isUninitialized,
        isError,
      };
    },
  });
};
