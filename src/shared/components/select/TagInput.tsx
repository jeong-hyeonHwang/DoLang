import type React from 'react';
import { useState, useRef, type KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  minTags?: number; // 최소 태그 수 추가
  error?: string;
}

const InputContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem;
  background-color: white;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #f3f4f6;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #374151;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.125rem;
    border-radius: 50%;

    &:hover {
      background-color: #e5e7eb;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  padding: 0.25rem;
  font-size: 0.875rem;

  &::placeholder {
    color: #9ca3af;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const TagCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  text-align: right;
`;

export default function TagInput({ value, onChange, maxTags = 10, minTags = 3, error }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // 입력값이 없을 때 백스페이스를 누르면 마지막 태그 삭제
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.endsWith(',')) {
      // 쉼표로 태그 추가
      setInputValue('');
      const tag = newValue.slice(0, -1).trim();
      if (tag && !value.includes(tag) && value.length < maxTags) {
        onChange([...value, tag]);
      }
    } else {
      setInputValue(newValue);
    }
  };

  return (
    <div>
      <InputContainer onClick={() => inputRef.current?.focus()}>
        <TagsContainer>
          {value.map((tag, index) => (
            <Tag key={index}>
              #{tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                disabled={value.length <= minTags} // 최소 태그 수보다 적으면 삭제 비활성화
              >
                <X size={14} />
              </button>
            </Tag>
          ))}
        </TagsContainer>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            value.length < maxTags
              ? `# 관심있는 주제의 태그를 입력해주세요. (${minTags}개 이상)`
              : '태그를 모두 입력했습니다.'
          }
          disabled={value.length >= maxTags}
        />
      </InputContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <TagCount>
        {value.length}/{maxTags} (최소 {minTags}개)
      </TagCount>
    </div>
  );
}
