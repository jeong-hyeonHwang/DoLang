'use client';

import type React from 'react';
import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import { X } from 'lucide-react';
import { debounce } from 'lodash';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  minTags?: number;
  error?: string;
}

interface SearchResult {
  tag: string;
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

export default function TagInput({ value, onChange, maxTags = 10, minTags = 3, error }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // // API 호출 관련
  // const searchTags = async (query: string): Promise<SearchResult[]> => {
  //   try {
  //     const response = await fetch(`/api/tags/search?q=${encodeURIComponent(query)}`);
  //     if (!response.ok) throw new Error('Failed to fetch tags');
  //     return await response.json();
  //   } catch (error) {
  //     console.error('Tag search error:', error);
  //     return [];
  //   }
  // };

  const debouncedSearch = debounce(async (query: string) => {
    if (query.length >= 2) {
      const results = await searchTags(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    if (inputValue && !inputValue.startsWith('#')) {
      debouncedSearch(inputValue);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().replace(/^#/, '');
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue('');
      setSuggestions([]);
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
      const tag = newValue.slice(1, -1).trim();
      if (tag && !value.includes(tag) && value.length < maxTags) {
        onChange([...value, tag]);
        setInputValue('');
        setSuggestions([]);
      }
    } else {
      setInputValue(newValue);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    if (!value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
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
            onKeyDown={handleKeyDown}
            placeholder={
              value.length < maxTags
                ? `# 관심있는 주제의 태그를 입력해주세요. (${minTags}개 이상)`
                : '태그를 모두 입력했습니다.'
            }
            disabled={value.length >= maxTags}
          />
          {suggestions.length > 0 && (
            <SuggestionsContainer>
              {suggestions.map((suggestion, index) => (
                <SuggestionItem key={index} onClick={() => handleSuggestionClick(suggestion.tag)}>
                  #{suggestion.tag}
                  <span>({suggestion.count})</span>
                </SuggestionItem>
              ))}
            </SuggestionsContainer>
          )}
        </SearchSection>

        <TagSection>
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
                >
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
