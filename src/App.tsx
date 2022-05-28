/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';

import { BridgeDetails } from './components/BridgeDetails';
import { LightSwitch } from './components/LightSwitch';

const AppContainer = styled('div')`
  text-align: center;
`;

const AppHeader = styled('header')`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

function App() {
  return (
    <AppContainer>
      <AppHeader>
        <BridgeDetails />
        <LightSwitch lightId={2} />
      </AppHeader>
    </AppContainer>
  );
}

export default App;
