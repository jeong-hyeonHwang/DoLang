import React, { useState } from 'react';
import { Select } from 'antd';
import proficiencyLevel from './proficiencyLevel.json';

interface ProficiencyLevelProps {
  value?: string;
  onChange?: (value: string) => void;
}

const ProficiencyLevelPicker: React.FC<ProficiencyLevelProps> = ({ value, onChange }) => {
  const [selectedProficiencyLevel, setSelectedProficiencyLevel] = useState<string | null>(value || null);

  const handelChange = (value: string) => {
    const selected = proficiencyLevel.find((level) => level.value === value);
    if (selected) {
      // const selectedData = { value: selected.value, label: selected.label };
      // console.log('Selected ProficiencyLevel:', JSON.stringify(selectedData, null, 2));
      setSelectedProficiencyLevel(selected.value);
      onChange?.(value);
    }
  };

  return (
    <Select
      showSearch
      style={{ width: 150, height: 40, borderRadius: '8px' }}
      placeholder="Select ProficiencyLevel"
      optionFilterProp="title"
      filterOption={(input, option) => option?.title?.toLowerCase().includes(input.toLowerCase()) ?? false}
      options={proficiencyLevel.map(({ value, label }) => ({
        value,
        label: <span>{label}</span>,
        title: label,
      }))}
      value={selectedProficiencyLevel}
      onChange={handelChange}
      dropdownRender={(menu) => (
        <div>
          {menu}
          <div style={{ padding: '8px', textAlign: 'center', fontSize: '12px', color: '#aaa' }}>Select a Level</div>
        </div>
      )}
    />
  );
};

export default ProficiencyLevelPicker;
