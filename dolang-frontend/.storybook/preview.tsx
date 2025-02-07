import type { Preview } from '@storybook/react';
import { BrowserRouter } from 'react-router';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
  (Story) => {
    return (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    );
  },
];

export default preview;
