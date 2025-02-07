import type { Meta, StoryObj } from '@storybook/react';

import Anchor from '../shared/components/Anchor';

const meta: Meta<typeof Anchor> = {
  component: Anchor,
  title: 'components/Anchor',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Anchor>;

export const Default: Story = {
  args: {},
};
