import React, { useState, forwardRef } from 'react';
import { Select } from 'antd';
import 'flag-icons/css/flag-icons.min.css';
import countries from '../Picker/countries.json';

interface CountryPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

const CountryPicker: React.FC<CountryPickerProps> = forwardRef(({ value, onChange }: CountryPickerProps, ref) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(value || null);

  const handleChange = (value: string) => {
    const selected = countries.find((country) => country.value === value);
    if (selected) {
      setSelectedCountry(selected.value);
      onChange?.(value); // Call the parent component's onChange function
    }
  };

  return (
    <Select
      ref={ref} // Pass the ref here
      showSearch
      style={{ width: 150, height: 40, borderRadius: '8px' }}
      placeholder="Select Country"
      optionFilterProp="title"
      filterOption={(input, option) => option?.title?.toLowerCase().includes(input.toLowerCase()) ?? false}
      // Map countries to options with flags and labels
      options={countries.map(({ value, label, flag }) => ({
        value,
        label: (
          <span>
            {flag ? <span className={`fi fi-${flag}`} style={{ marginRight: 8 }}></span> : null}
            {label}
          </span>
        ),
        title: label,
      }))}
      value={selectedCountry}
      onChange={handleChange}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <div style={{ padding: '8px', textAlign: 'center', fontSize: '12px', color: '#aaa' }}>Select a Country</div>
        </div>
      )}
    />
  );
});

export default CountryPicker;
