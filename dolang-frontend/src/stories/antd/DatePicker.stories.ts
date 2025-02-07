import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DatePicker from '../shared/components/DatePicker';
import moment from 'moment';

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: 'components/DatePicker',
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {},
};

// export const WithPredefinedDate: Story = {
//   args: {
//     selectedDate: moment('2025-01-01'),
//   },
// };

// export const WithTodayDate: Story = {
//   args: {
//     selectedDate: moment(),
//   },
// };
