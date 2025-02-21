import type React from 'react';
import { useState, useRef, useEffect, type KeyboardEvent, FormEvent } from 'react';
import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { tagsSearchGet } from '../../../api/utils/tagsSearch_get';
import Cookies from 'js-cookie';

interface TagInputProps {
  value: { tagId: number; name: string }[];
  onChange: (tags: { tagId: number; name: string }[]) => void;
  maxTags?: number;
  minTags?: number;
  error?: string;
  nativeLanguageId: string;
}

interface SearchResult {
  tag: {
    tagId: number;
    name: string;
  };
  count: number;
}

const InputContainer = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: white;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SearchSection = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
`;

const TagSection = styled.div`
  padding: 0.75rem;
  flex: 1;
  background-color: #fafafa;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  padding: 0.375rem;
  font-size: 0.875rem;
  color: #374151;

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background-color: transparent;
    cursor: not-allowed;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    border-color: #d1d5db;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.125rem;
    border-radius: 50%;
    opacity: 0.7;
    transition: opacity 0.2s;
    cursor: pointer;

    &:hover {
      opacity: 1;
      background-color: #fee2e2;
      color: #ef4444;
    }
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

const SuggestionsContainer = styled.div`
  margin-top: 0.5rem;
`;

const SuggestionItem = styled.button`
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    color: #3b82f6;
  }

  span {
    color: #6b7280;
    font-size: 0.75rem;
  }
`;

export default function TagInput({
  value,
  onChange,
  maxTags = 10,
  minTags = 3,
  error,
  nativeLanguageId,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const access_token = Cookies.get('access_token');

  const searchTags = async (query: string) => {
    const stringQuery = query.replace(/^#/, '');
    if (query.length >= 1) {
      const results = await tagsSearchGet(nativeLanguageId, stringQuery, access_token);
      setSuggestions(results.map((tag) => ({ tag: { tagId: tag.tagId, name: tag.name }, count: 0 })));
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    const query = (e.target as HTMLInputElement).value;
    searchTags(query);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (newValue && !newValue.startsWith('#')) {
      newValue = `#${newValue}`;
    }

    if (newValue.endsWith(',')) {
      const name = newValue.slice(1, -1).trim();
      const tag = suggestions.find((s) => s.tag.name.toLowerCase() === name.toLowerCase());

      if (tag && !value.some((t) => t.tagId === tag.tag.tagId) && value.length < maxTags) {
        onChange([...value, { tagId: tag.tag.tagId, name: typeof tag.tag.name === 'string' ? tag.tag.name : '' }]);
        setInputValue('');
        setSuggestions([]);
      }
    } else {
      setInputValue(newValue);
    }
  };

  const handleSuggestionClick = (tag: { tagId: number; name: string }, e: React.MouseEvent) => {
    e.preventDefault();

    if (value.some((t) => t.tagId === tag.tagId)) {
      alert('이미 추가된 태그입니다.');
      return;
    }

    if (!value.some((t) => t.tagId === tag.tagId) && value.length < maxTags) {
      onChange([...value, { tagId: tag.tagId, name: typeof tag.name === 'string' ? tag.name : '' }]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  return (
    <div>
      <InputContainer>
        <SearchSection>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
            placeholder={
              value.length < maxTags
                ? `# 관심있는 주제의 태그를 입력해주세요. (${minTags}개 이상)`
                : '태그를 모두 입력했습니다.'
            }
            disabled={value.length >= maxTags}
          />

          <SuggestionsContainer style={{ marginTop: '30px' }}>
            {suggestions.length === 0 ? (
              <span>검색 결과가 없습니다.</span>
            ) : (
              suggestions.slice(0, 20).map((suggestion, index) => (
                <SuggestionItem key={index} onClick={(e) => handleSuggestionClick(suggestion.tag, e)}>
                  #{suggestion.tag.name}
                </SuggestionItem>
              ))
            )}
          </SuggestionsContainer>
        </SearchSection>

        <TagSection>
          <TagsContainer>
            {value.map((tag, index) => (
              <Tag key={index}>
                #{typeof tag.name === 'string' ? tag.name : tag.name?.name || ''} {/* 문자열만 출력 */}
                <button type="button" onClick={() => removeTag(index)}>
                  <X size={14} />
                </button>
              </Tag>
            ))}
          </TagsContainer>
        </TagSection>
      </InputContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      <TagCount>
        {value.length}/{maxTags} (최소 {minTags}개)
      </TagCount>
    </div>
  );
}
