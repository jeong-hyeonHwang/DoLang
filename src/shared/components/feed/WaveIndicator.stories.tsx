import type { Meta, StoryObj } from '@storybook/react';

import WaveIndicator from './WaveIndicator';

const meta: Meta<typeof WaveIndicator> = {
  component: WaveIndicator,
  title: 'WaveIndicator',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof WaveIndicator>;

export const Default: Story = {
  args: {},
};
