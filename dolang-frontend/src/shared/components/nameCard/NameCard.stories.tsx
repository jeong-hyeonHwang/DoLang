import type { Meta, StoryObj } from '@storybook/react';
import { NameCard } from './NameCard.tsx';

const meta: Meta<typeof NameCard> = {
  component: NameCard,
  title: 'NameCard',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof NameCard>;

export const Default: Story = {
  args: {
    children: '홍길동',
    style: {
      border: 'none',
      backgroundColor: 'transparent',
    },
  },
};

export const WithCustomChildren: Story = {
  args: {
    children: 'John Doe',
    style: {
      border: '1px solid #eee',
    },
  },
};
