import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { ChevronDown } from 'lucide-react';

// 타입 정의
interface Country {
  code: string;
  name: string;
  flag: string;
}

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// 스타일링
const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const DropdownContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.25rem;
  background-color: #1f2937;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 15rem;
  overflow-y: auto;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

const OptionItem = styled.div<{ isSelected: boolean }>`
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: white;

  &:hover {
    background-color: #374151;
  }

  ${(props) =>
    props.isSelected &&
    `
    background-color: #374151;
  `}

  img {
    width: 1.5rem;
    height: 1rem;
    object-fit: cover;
    border-radius: 2px;
  }
`;

const SelectedContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  img {
    width: 1.5rem;
    height: 1rem;
    object-fit: cover;
    border-radius: 2px;
  }
`;

// 국가 데이터
const countries: Country[] = [
  {
    code: 'US',
    name: 'USA',
    flag: 'https://flagcdn.com/us.svg',
  },
  {
    code: 'KR',
    name: '대한민국',
    flag: 'https://flagcdn.com/kr.svg',
  },
  {
    code: 'JP',
    name: '일본',
    flag: 'https://flagcdn.com/jp.svg',
  },
  {
    code: 'CN',
    name: '중국',
    flag: 'https://flagcdn.com/cn.svg',
  },
  {
    code: 'GB',
    name: '영국',
    flag: 'https://flagcdn.com/gb.svg',
  },
];

export default function CountrySelect({ value, onChange, error }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedCountry = countries.find((country) => country.code === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SelectContainer ref={containerRef}>
      <SelectButton type="button" onClick={() => setIsOpen(!isOpen)}>
        <SelectedContent>
          {selectedCountry ? (
            <>
              <img src={selectedCountry.flag || '/placeholder.svg'} alt={`${selectedCountry.name} flag`} />
              <span>{selectedCountry.name}</span>
            </>
          ) : (
            <span>국가 선택</span>
          )}
        </SelectedContent>
        <ChevronDown size={20} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </SelectButton>

      <DropdownContainer isOpen={isOpen}>
        {countries.map((country) => (
          <OptionItem
            key={country.code}
            isSelected={country.code === value}
            onClick={() => {
              onChange(country.code);
              setIsOpen(false);
            }}
          >
            <img src={country.flag || '/placeholder.svg'} alt={`${country.name} flag`} />
            <span>{country.name}</span>
          </OptionItem>
        ))}
      </DropdownContainer>

      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </SelectContainer>
  );
}
