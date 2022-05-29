import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useCallback, useEffect } from 'react';

import { useLocalStorage } from '@/hooks/useLocalStorage';

type HueItemDetails = {
  id: string;
  internalipaddress: string;
  port: number;
};

export type SuccessfulLightDetails = {
  state: {
    on: boolean;
    bri: number;
    alert: string;
    mode: string;
    reachable: string;
  };
  type: string;
  name: string;
};

type Lights = Record<string, SuccessfulLightDetails>;

const BRIDGE_IP_LOCAL_STORAGE_KEY = 'bridgeIP';

console.log(import.meta.env);
const BRIDGE_API_KEY = import.meta.env.VITE_BRIDGE_API_KEY;
if (!BRIDGE_API_KEY) {
  throw new Error('Missing bridge API key. Please add it to your `.env` file and try again.');
}

const getBridgeIpFromStorage = () => {
  return JSON.parse(window.localStorage.getItem(BRIDGE_IP_LOCAL_STORAGE_KEY) ?? '');
};

const baseQueryWithBridgeIp: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const bridgeIp = getBridgeIpFromStorage();
  if (!bridgeIp) {
    return {
      error: {
        status: 500,
        data: {
          detail: 'No bridge IP available - unable to update light',
        },
      },
    };
  }

  const baseQuery = fetchBaseQuery({
    baseUrl: `http://${bridgeIp}/api/${BRIDGE_API_KEY}/`,
  });
  return baseQuery(args, api, extraOptions);
};

export const api = createApi({
  baseQuery: baseQueryWithBridgeIp,
  tagTypes: ['light'],
  endpoints: (build) => ({
    getHueItems: build.query<HueItemDetails[], void>({
      query: () => `https://discovery.meethue.com/`,
    }),
    getLights: build.query<Lights, void>({
      query: () => `lights/`,
      providesTags: ['light'],
    }),
    updateLight: build.mutation<
      unknown,
      { lightId: number; lightState: 'on' | 'off'; brightness: number }
    >({
      query: ({ lightId, lightState, brightness }) => ({
        url: `lights/${lightId}/state`,
        method: 'PUT',
        body: {
          on: lightState === 'on',
          bri: brightness,
        },
      }),
      invalidatesTags: ['light'],
    }),
  }),
});

export const { useGetHueItemsQuery, useGetLightsQuery, useUpdateLightMutation } = api;

const getBridgeIpFromHueItems = (hueItems: HueItemDetails[] | undefined): string | undefined => {
  return hueItems?.[0]?.internalipaddress;
};

export const useGetBridgeIP = () => {
  const [bridgeIp, setBridgeIp] = useLocalStorage(BRIDGE_IP_LOCAL_STORAGE_KEY, '192.168.1.103');
  const isSkipped = !!bridgeIp;

  const result = useGetHueItemsQuery(undefined, {
    skip: isSkipped,
    selectFromResult: ({ data, isFetching, isSuccess, isError, isUninitialized }) => {
      return {
        freshBridgeIp: getBridgeIpFromHueItems(data),
        isSuccess,
        isFetching: isFetching || isUninitialized,
        isUninitialized,
        isError,
      };
    },
  });
  useEffect(() => {
    if (!result.isSuccess) return;
    setBridgeIp(result.freshBridgeIp);
  }, [setBridgeIp, result.isSuccess, result.freshBridgeIp]);

  const clearIp = useCallback(() => {
    setBridgeIp('');
  }, [setBridgeIp]);

  const rawRefetch = result.refetch;
  const refetch = useCallback(() => {
    if (isSkipped) {
      clearIp();
    } else {
      rawRefetch();
    }
  }, [isSkipped, clearIp, rawRefetch]);

  return { ...result, bridgeIp, clearIp, refetch, isSkipped };
};

export const useGetLight = (lightId: number) => {
  return useGetLightsQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching, isSuccess, isError, isUninitialized }) => ({
      light: data?.[lightId],
      isLoading,
      isFetching: isFetching,
      isUninitialized,
      isSuccess,
      isError,
    }),
  });
};
