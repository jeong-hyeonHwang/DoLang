import type { Meta, StoryObj } from '@storybook/react';

import CountryPicker from '../shared/components/CountryPicker';

const meta: Meta<typeof CountryPicker> = {
  component: CountryPicker,
  title: 'components/CountryPicker',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof CountryPicker>;

export const Default: Story = {
  args: {},
};
