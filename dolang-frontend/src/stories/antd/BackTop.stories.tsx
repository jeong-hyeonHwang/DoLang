import type { Meta, StoryObj } from '@storybook/react';

import BactTop from '../shared/components/BackTop';

const meta: Meta<typeof BactTop> = {
  component: BactTop,
  title: 'components/BackTop',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof BactTop>;

export const Default: Story = {
  args: {},
};
