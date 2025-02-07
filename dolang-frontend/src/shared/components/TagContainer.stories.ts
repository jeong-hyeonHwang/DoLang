import type { Meta, StoryObj } from '@storybook/react';
import { TagContainer } from './TagContainer.tsx';

const meta: Meta<typeof TagContainer> = {
  component: TagContainer,
  title: 'TagContainer',
  tags: ['autodocs'],
  argTypes: {
    handleTagClick: {
      control: {
        type: 'function',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof TagContainer>;

export const Default: Story = {
  args: {},
};
