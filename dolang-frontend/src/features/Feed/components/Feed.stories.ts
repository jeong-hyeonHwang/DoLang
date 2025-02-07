import type { Meta, StoryObj } from '@storybook/react';

import Feed from './Feed.tsx';

const meta: Meta<typeof Feed> = {
  component: Feed,
  title: 'Feed',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof Feed>;

export const Default: Story = {
  args: {
    user: {
      id: '1',
      name: 'John Doe',
    },
    content: {
      id: '1',
      text: 'Hello, world!',
    },
    createdAt: new Date(),
  },
};
