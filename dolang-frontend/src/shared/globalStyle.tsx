import { css, Global } from '@emotion/react';

const baseStyle = css`
  @import 'node_modules/modern-normalize/modern-normalize.css';
  :root {
    font-family:
      Noto Sans KR,
      Inter,
      system-ui,
      Avenir,
      Helvetica,
      Arial,
      sans-serif;
    line-height: 1.5;
    font-weight: 400;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    font-weight: 500;
    color: #4c4c4c;
    text-decoration: none;
  }
  a:hover {
    color: #000000;
  }

  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }
  button:hover {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
  }

  @media (prefers-color-scheme: light) {
    :root {
      color: #213547;
      background-color: #ffffff;
    }
    a:hover {
      color: #000000;
    }
    button {
      background-color: #f9f9f9;
    }
  }
`;

export const GlobalStyle = () => <Global styles={baseStyle} />;
