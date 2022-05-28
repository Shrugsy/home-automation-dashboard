/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { IconButton } from '@mui/material';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import SignalWifiBadIcon from '@mui/icons-material/SignalWifiBad';

import { useGetBridgeIP } from '@/service/api';

export function BridgeDetails() {
  const bridgeIpResult = useGetBridgeIP();

  const getIconEl = () => {
    if (
      (bridgeIpResult.isSuccess && !bridgeIpResult.isFetching) ||
      (bridgeIpResult.isSkipped && !bridgeIpResult.isError)
    ) {
      return <NetworkWifiIcon color="success" />;
    }
    if (bridgeIpResult.isFetching) return <HourglassBottomIcon sx={{ color: 'orange' }} />;
    return <SignalWifiBadIcon color="error" />;
  };

  return (
    <div>
      <IconButton onClick={bridgeIpResult.refetch}>{getIconEl()}</IconButton>
    </div>
  );
}
