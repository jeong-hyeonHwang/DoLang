import React, { useState } from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import styled from '@emotion/styled';
import moment, { Moment } from 'moment';

const StyledDatePicker = styled(AntdDatePicker)`
  &.ant-picker {
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    padding: 8px;

    &:hover,
    &:focus {
      border: 2px solid #717171;
    }
  }
`;

// const DatePickerWrapper = styled.div`
//   margin: 20px;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
// `;

interface DatePickerProps {
  selectedDate?: Moment | null;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate }) => {
  const [date, setDate] = useState<Moment | null>(null);

  const handleChange = (date: Moment | null, dateString: string) => {
    setDate(date);
    console.log(date, dateString);
  };

  return (
    // <DatePickerWrapper>
    <StyledDatePicker
      placeholder="Pick a date"
      value={selectedDate}
      onChange={handleChange}
      format="YYYY-MM-DD"
      //   popupClassName="custom-dropdown"
    />
    // </DatePickerWrapper>
  );
};

export default DatePicker;
