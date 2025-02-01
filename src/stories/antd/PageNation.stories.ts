import type { Meta, StoryObj } from '@storybook/react';

import PageNation from '../shared/components/PageNation';

const meta: Meta<typeof PageNation> = {
  component: PageNation,
  title: 'components/PageNation',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof PageNation>;

export const Default: Story = {
  args: {},
};
