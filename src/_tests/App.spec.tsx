/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';

import { setUpStore } from '@/store';
import { createHandlers } from '@/_mocks/handlers';

import App from '../App';

import { mswTestServer } from './__setup__';

function setUpApp() {
  mswTestServer.use(...createHandlers());
  const store = setUpStore();

  render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
}

/**
 * @vitest-environment jsdom
 */
describe('App test', () => {
  it('Does nothing in particular (TODO: tests)', () => {
    setUpApp();
    screen.getByText('Hello world');
  });
});
