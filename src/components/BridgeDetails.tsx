/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { IconButton } from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import SignalWifiBadIcon from '@mui/icons-material/SignalWifiBad';

import { useGetBridgeIP } from '@/service/api';

export function BridgeDetails() {
  const { bridgeIp, isFetching, isError, refetch } = useGetBridgeIP();

  const isValid = bridgeIp && !isError;

  const getIconEl = () => {
    if (isFetching) return <HourglassBottomIcon color="info" />;
    if (isValid) return <NetworkWifiIcon color="success" />;
    return <SignalWifiBadIcon color="error" />;
  };

  return (
    <div>
      <IconButton onClick={refetch}>{getIconEl()}</IconButton>
    </div>
  );
}
