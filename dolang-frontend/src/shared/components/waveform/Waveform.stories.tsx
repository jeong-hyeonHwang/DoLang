import type { Meta, StoryObj } from '@storybook/react';

import Waveform from './Waveform.tsx';

const meta: Meta<typeof Waveform> = {
  component: Waveform,
  title: 'Waveform',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Waveform>;

export const Default: Story = {
  args: {},
};
