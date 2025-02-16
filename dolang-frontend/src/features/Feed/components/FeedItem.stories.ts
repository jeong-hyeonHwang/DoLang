import type { Meta, StoryObj } from '@storybook/react';

import { FeedItem } from './FeedItem.tsx';

const meta: Meta<typeof FeedItem> = {
  component: FeedItem,
  title: 'Feed',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof FeedItem>;

export const Default: Story = {
  args: {
    postId: 1,
    profileImageUrl: 'https://via.placeholder.com/150',
    country: 'KR',
    voiceUrl: 'https://via.placeholder.com/150',
    voiceCreatedAt: '2021-01-01',
    bookmarkCount: 10,
  },
};
