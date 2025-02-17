import React, { useState, forwardRef, useEffect } from 'react';
import { Select } from 'antd';
import proficiencyLevel from './proficiencyLevel.json';

interface ProficiencyLevelProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ProficiencyLevelPicker = forwardRef<HTMLSelectElement, ProficiencyLevelProps>(({ value, onChange }, ref) => {
  const [selectedProficiencyLevel, setSelectedProficiencyLevel] = useState<string | null>(value || null);

  const user = sessionStorage.getItem('user');
  const userProficiencyLevel = user ? JSON.parse(user).proficiencyLevel : null;

  useEffect(() => {
    if (userProficiencyLevel) {
      setSelectedProficiencyLevel(userProficiencyLevel);
    }
  }, [value, userProficiencyLevel]);

  const handleChange = (value: string) => {
    const selected = proficiencyLevel.find((level) => level.value === value);
    if (selected) {
      setSelectedProficiencyLevel(selected.value);
      onChange?.(value);
    }
  };

  return (
    <Select
      ref={ref}
      showSearch
      style={{ width: 150, height: 40, borderRadius: '8px' }}
      placeholder="Select Proficiency Level"
      optionFilterProp="title"
      filterOption={(input, option) => option?.title?.toLowerCase().includes(input.toLowerCase()) ?? false}
      options={proficiencyLevel.map(({ value, label }) => ({
        value,
        label: <span>{label}</span>,
        title: label,
      }))}
      value={selectedProficiencyLevel}
      onChange={handleChange}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <div style={{ padding: '8px', textAlign: 'center', fontSize: '12px', color: '#aaa' }}>Select a Level</div>
        </div>
      )}
    />
  );
});

export default ProficiencyLevelPicker;
