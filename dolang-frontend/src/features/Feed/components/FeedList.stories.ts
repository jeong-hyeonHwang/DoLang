import type { Meta, StoryObj } from '@storybook/react';
import FeedList from './BaseFeedList.tsx';

const meta: Meta<typeof FeedList> = {
  component: FeedList,
  title: 'FeedList',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;
type Story = StoryObj<typeof FeedList>;

export const Default: Story = {
  args: {},
};
