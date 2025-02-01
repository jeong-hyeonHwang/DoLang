import type { Meta, StoryObj } from '@storybook/react';

import { NavBarContainer } from './NavBarContainer';

const meta: Meta<typeof NavBarContainer> = {
  component: NavBarContainer,
  title: 'NavBarContainer',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof NavBarContainer>;

export const Default: Story = {
  args: {},
};
