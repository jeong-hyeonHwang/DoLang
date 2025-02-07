import React, { useState } from 'react';
import { Tag, Input } from 'antd';

const tagList = ['태그1', '태그2', '태그3', '태그4', '태그5'];

const SelectableTag = ({
  tag,
  isSelected,
  onSelect,
}: {
  tag: string;
  isSelected: boolean;
  onSelect: (tag: string) => void;
}) => (
  <Tag color={isSelected ? 'blue' : 'default'} onClick={() => onSelect(tag)}>
    {tag}
  </Tag>
);

const SelectedTagList = ({ selectedTags, onRemove }: { selectedTags: string[]; onRemove: (tag: string) => void }) => (
  <div>
    {selectedTags.map((tag) => (
      <Tag key={tag} color="green" closable onClose={() => onRemove(tag)}>
        {tag}
      </Tag>
    ))}
  </div>
);

const TagSearchBar = ({
  inputValue,
  handleChange,
}: {
  inputValue: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return <Input placeholder="태그 검색" value={inputValue} onChange={handleChange} />;
};

export const TagContainer = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleTagAdd = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prevTags) => [...prevTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const filteredTags =
    inputValue.trim() === '' ? [] : tagList.filter((tag) => tag.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <>
      {/* 검색 필드 */}
      <TagSearchBar inputValue={inputValue} handleChange={handleInputChange} />

      {/* 필터링된 태그 */}
      <div>
        {filteredTags.map((tag) => (
          <SelectableTag key={tag} tag={tag} isSelected={selectedTags.includes(tag)} onSelect={handleTagAdd} />
        ))}
      </div>

      {/* 선택된 태그 */}
      <SelectedTagList selectedTags={selectedTags} onRemove={handleTagRemove} />
    </>
  );
};
