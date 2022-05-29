/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import { Button, ButtonGroup, Slider } from '@mui/material';
import { useEffect, useState } from 'react';

import { useGetLight, useUpdateLightMutation } from '@/service/api';
import { useDebounce } from '@/hooks/useDebounce';

type LightSwitchProps = {
  lightId: number;
};
export function LightSwitch({ lightId }: LightSwitchProps) {
  const [updateLight] = useUpdateLightMutation();
  const [isSliderTouched, setIsSliderTouched] = useState(false);
  const [brightness, setBrightness] = useState(255);
  const debouncedBrightness = useDebounce(brightness, 500);
  const getLightResult = useGetLight(lightId);

  const isLightReachable = getLightResult.light?.state.reachable;

  const lightName = getLightResult.light?.name ?? 'Unknown light';

  const receivedBrightness = getLightResult.light?.state.bri;

  useEffect(() => {
    if (!receivedBrightness) return;
    setBrightness(receivedBrightness);
  }, [receivedBrightness]);

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

  const isLightOn = getLightResult.light?.state.on;
  const isLightOff = getLightResult.light?.state.on === false;

  return (
    <div>
      <div>
        {lightName}
        {!isLightReachable ? ' (unreachable)' : ''}
      </div>
      <div>
        <ButtonGroup disabled={!isLightReachable} variant="outlined">
          <Button onClick={getLightResult.refetch}>
            <ReplayIcon />
          </Button>
          <Button
            onClick={() => handleLight('off')}
            variant={isLightOff ? 'contained' : 'outlined'}
          >
            <LightbulbOutlinedIcon />
          </Button>
          <Button onClick={() => handleLight('on')} variant={isLightOn ? 'contained' : 'outlined'}>
            <LightbulbIcon />
          </Button>
        </ButtonGroup>
      </div>
      <Slider
        disabled={!isLightReachable}
        min={0}
        max={255}
        value={brightness}
        onChange={handleChange}
      />
    </div>
  );
}
