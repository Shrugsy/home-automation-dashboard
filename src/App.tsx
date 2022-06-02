/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import styled from '@emotion/styled';

import { BridgeDetails } from './components/BridgeDetails';
import { Lights } from './components/Lights';

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
  color: white;
`;

function App() {
  return (
    <AppContainer>
      <AppHeader>
        <BridgeDetails />
        <Lights />
      </AppHeader>
    </AppContainer>
  );
}

export default App;
