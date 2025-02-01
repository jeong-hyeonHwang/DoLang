import type { Meta, StoryObj } from '@storybook/react';

import CustomFloating from '../shared/components/CustomFloating';

const meta: Meta<typeof CustomFloating> = {
  component: CustomFloating,
  title: 'custom/CustomFloating',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof CustomFloating>;

export const Default: Story = {
  args: {},
};
