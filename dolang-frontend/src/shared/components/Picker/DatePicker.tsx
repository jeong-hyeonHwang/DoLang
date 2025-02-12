import React, { useState, forwardRef } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import styled from '@emotion/styled';
import moment, { Moment } from 'moment';

const StyledDatePicker = styled(AntdDatePicker)`
  &.ant-picker {
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    padding: 8px;
    width: 150px;

    &:hover,
    &:focus {
      border: 2px solid #717171;
    }
  }
`;

interface DatePickerProps {
  selectedDate?: Moment | null;
}

const DatePicker = forwardRef<any, DatePickerProps>(({ selectedDate }, ref) => {
  const [date, setDate] = useState<Moment | null>(null);

  const handleChange = (date: Moment | null, dateString: string) => {
    setDate(date);
    console.log(date, dateString);
  };

  return (
    <StyledDatePicker
      ref={ref}
      placeholder="Pick a date"
      value={selectedDate}
      onChange={handleChange}
      format="YYYY-MM-DD"
    />
  );
});

export default DatePicker;
