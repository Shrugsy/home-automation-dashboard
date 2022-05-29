/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useMemo } from 'react';
import { Button } from '@mui/material';

import { useGetLightsQuery } from '@/service/api';

import { LightSwitch } from './LightSwitch';

type LightsProps = {
  reachableOnly?: boolean;
};
export function Lights({ reachableOnly = true }: LightsProps) {
  const { data, isLoading, isError, refetch } = useGetLightsQuery();
  const lightIds = useMemo(() => {
    if (!data) return [];
    if (reachableOnly) {
      return Object.entries(data)
        .filter(([lightId, lightDetails]) => {
          return lightDetails.state.reachable;
        })
        .map(([lightId]) => Number(lightId));
    }
    return Object.keys(data).map(Number);
  }, [data, reachableOnly]);

  return (
    <div>
      {isLoading ? (
        'Loading lights...'
      ) : isError ? (
        <Button onClick={refetch}>Error fetching lights. Retry?</Button>
      ) : (
        lightIds.map((id) => <LightSwitch key={id} lightId={id} />)
      )}
    </div>
  );
}
