/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import { Button, ButtonGroup, Slider } from '@mui/material';
import { useEffect, useState } from 'react';

import { SuccessfulLightDetails, useGetLightQuery, useUpdateLightMutation } from '@/service/api';
import { useDebounce } from '@/hooks/useDebounce';

type LightSwitchProps = {
  lightId: number;
};
export function LightSwitch({ lightId }: LightSwitchProps) {
  const [updateLight] = useUpdateLightMutation();
  const [isSliderTouched, setIsSliderTouched] = useState(false);
  const [brightness, setBrightness] = useState(255);
  const debouncedBrightness = useDebounce(brightness, 500);
  const getLightResult = useGetLightQuery({ lightId });
  const isLightResultSuccessful =
    getLightResult.data && 'state' in getLightResult.data && getLightResult.data.state.reachable;

  const lightName = isLightResultSuccessful
    ? (getLightResult.data as SuccessfulLightDetails).name
    : 'Unknown light';

  useEffect(() => {
    if (!getLightResult.data || !('state' in getLightResult.data)) return;
    setBrightness(getLightResult.data.state.bri);
  }, [getLightResult.data]);

  useEffect(() => {
    if (!isSliderTouched) return;
    updateLight({ lightId, lightState: 'on', brightness: debouncedBrightness });
  }, [isSliderTouched, debouncedBrightness, updateLight, lightId]);

  const handleLight = (lightState: 'on' | 'off') => {
    updateLight({ lightId, lightState, brightness });
  };

  const handleChange = (event: Event, newValue: number | number[]) => {
    setIsSliderTouched(true);
    setBrightness(newValue as number);
  };

  return (
    <div>
      <div>{lightName}</div>
      <div>
        <ButtonGroup disabled={!isLightResultSuccessful} variant="contained">
          <Button onClick={getLightResult.refetch}>
            <ReplayIcon />
          </Button>
          <Button onClick={() => handleLight('off')}>
            <LightbulbOutlinedIcon />
          </Button>
          <Button onClick={() => handleLight('on')}>
            <LightbulbIcon />
          </Button>
        </ButtonGroup>
      </div>
      <Slider
        disabled={!isLightResultSuccessful}
        min={0}
        max={255}
        value={brightness}
        onChange={handleChange}
      />
    </div>
  );
}
