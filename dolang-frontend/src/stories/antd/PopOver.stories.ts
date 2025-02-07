import type { Meta, StoryObj } from '@storybook/react';

import PopOver from '../shared/components/PopOver';

const meta: Meta<typeof PopOver> = {
  component: PopOver,
  title: 'components/PopOver',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof PopOver>;

export const Default: Story = {
  args: {},
};
