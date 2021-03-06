/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Global, css } from '@emotion/react';
import React, { ReactNode } from 'react';

export function GlobalStyles({ children }: { children: ReactNode }) {
  return (
    <>
      <Global
        styles={css`
          body {
            overflow: hidden;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
              'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            -webkit-app-region: drag;
            button {
              -webkit-app-region: no-drag;
            }
          }

          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
          }
        `}
      />
      {children}
    </>
  );
}
