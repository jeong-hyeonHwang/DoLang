import React, { useState } from 'react';
import { Select } from 'antd';
import 'flag-icons/css/flag-icons.min.css';
import languages from './languages.json';

interface LanguagePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

const LanguagePicker: React.FC<LanguagePickerProps> = ({ value, onChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(value || null);

  const handelChange = (value: string) => {
    const selected = languages.find((lang) => lang.value === value);
    if (selected) {
      // const selectedData = { value: selected.value, label: selected.label };
      // console.log('Selected Language:', JSON.stringify(selectedData, null, 2));
      setSelectedLanguage(selected.value);
      onChange?.(value);
    }
  };

  return (
    <Select
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
      value={selectedLanguage}
      onChange={handelChange}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <div style={{ padding: '8px', textAlign: 'center', fontSize: '12px', color: '#aaa' }}>Select a language</div>
        </div>
      )}
    />
  );
};

export default LanguagePicker;
