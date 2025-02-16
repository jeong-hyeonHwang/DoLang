import React, { useState } from 'react';
import { Select } from 'antd';
import 'flag-icons/css/flag-icons.min.css';
import languages from './languages.json';

interface LanguagePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

const LanguagePicker = React.forwardRef<HTMLDivElement, LanguagePickerProps>(({ value, onChange }, ref) => {
  return (
    <Select
      ref={ref} // ref 전달
      showSearch
      style={{ width: 150, height: 40, borderRadius: '8px' }}
      placeholder="Select Language"
      optionFilterProp="title"
      filterOption={(input, option) => option?.title?.toLowerCase().includes(input.toLowerCase()) ?? false}
      options={languages.map(({ value, label, flag }) => ({
        value,
        label: (
          <span>
            {flag ? <span className={`fi fi-${flag}`} style={{ marginRight: 8 }}></span> : null}
            {label}
          </span>
        ),
        title: label,
      }))}
      value={value}
      onChange={onChange}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <div style={{ padding: '8px', textAlign: 'center', fontSize: '12px', color: '#aaa' }}>Select a language</div>
        </div>
      )}
    />
  );
});

export default LanguagePicker;
