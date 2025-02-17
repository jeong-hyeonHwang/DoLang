import React, { useState } from 'react';
import { Select } from 'antd';
import 'flag-icons/css/flag-icons.min.css';
import languages from './languages.json';

interface LanguagePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const LanguagePicker = React.forwardRef<HTMLDivElement, LanguagePickerProps>(({ value, onChange, disabled }, ref) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(value || null);

  // const user = sessionStorage.getItem('user');
  // const userProficiencyLevel = user ? JSON.parse(user).proficiencyLevel : null;

  // useEffect(() => {
  //   if (userProficiencyLevel) {
  //     setSelectedProficiencyLevel(userProficiencyLevel);
  //   }
  // }, [value, userProficiencyLevel]);

  const handleChange = (value: string) => {
    const selected = languages.find((lang) => lang.value === value);
    console.log(selected);

    if (selected) {
      setSelectedLanguage(selected.value);
      if (onChange) {
        onChange(value);
      }
    }
  };

  return (
    <Select
      ref={ref}
      disabled={disabled}
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
      onChange={handleChange}
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
