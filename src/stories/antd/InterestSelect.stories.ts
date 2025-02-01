import type { Meta, StoryObj } from '@storybook/react';

import CountryPicker from '../shared/components/InterestSelect';

const meta: Meta<typeof CountryPicker> = {
  component: CountryPicker,
  title: 'components/InterestSelect',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof CountryPicker>;

export const Default: Story = {
  args: {},
};
