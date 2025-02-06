import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import CountrySelect from '@/shared/components/select/CountrySelect';
import TagInput from '@/shared/components/select/TagInput';

interface SignupFormData {
  nickname: string;
  nationality: string;
  nativeLanguage: string;
  targetLanguage: string;
  proficiencyLevel: string;
  interests: string[];
  agreement: boolean;
}

const PageContainer = styled.div`
  background-color: aliceblue;
  max-width: 600px;
  margin: 6rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  color: #1a1a1a;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
  color: #374151;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const NicknameGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
`;

const CheckButton = styled.button`
  padding: 0 1rem;
  background-color: #e5e7eb;
  color: #374151;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:hover {
    background-color: #d1d5db;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.span`
  color: #1024b9;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const TagInputStyled = styled.input`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;

  &::placeholder {
    color: #9ca3af;
  }
`;

const Agreement = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input {
    width: 1rem;
    height: 1rem;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: ${(props) => (props.disabled ? '#d1d5db' : '#3b82f6')};
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:not(:disabled) {
    &:hover {
      background-color: #2563eb;
    }
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

function SignupForm() {
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
  const [nicknameSuccessMessage, setNicknameSuccessMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const navigate = useNavigate;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    mode: 'onChange',
    defaultValues: {
      nationality: '',
      nativeLanguage: '',
      targetLanguage: '',
      proficiencyLevel: '',
      interests: [],
      agreement: false,
    },
  });

  useEffect(() => {
    setIsNicknameChecked(false);
    setNicknameErrorMessage('');
    setNicknameSuccessMessage('');
    setIsTyping(true);
  }, [watch('nickname')]);

  const checkNickname = async () => {
    const nickname = watch('nickname');
    if (!nickname) {
      setNicknameErrorMessage('닉네임을 입력해주세요.');
      return;
    }

    // 실제 API 대체
    const isAvailable = nickname !== 'test';

    if (isAvailable) {
      setIsNicknameChecked(true);
      setNicknameSuccessMessage('사용 가능한 닉네임입니다.');
      setNicknameErrorMessage('');
    } else {
      setIsNicknameChecked(false);
      setNicknameErrorMessage('이미 사용 중인 닉네임입니다.');
      setNicknameSuccessMessage('');
    }
    setIsTyping(false);
  };

  const onSubmit = (data: SignupFormData) => {
    if (!isNicknameChecked) {
      setNicknameErrorMessage('닉네임 중복 확인이 필요합니다.');
      return;
    }

    if (data.interests.length < 3) {
      setValue('interests', data.interests, {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    }

    // API 호출 로직이 들어갈 자리
    console.log(data);

    // 성공 알림
    alert('회원가입이 완료되었습니다!');
    navigate('/');
  };

  return (
    <>
      <PageContainer>
        <Logo>DoLang</Logo>
        <Title>회원가입</Title>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>닉네임</Label>
            <NicknameGroup>
              <Input
                {...register('nickname', { required: '닉네임을 입력해주세요.' })}
                placeholder="닉네임 설정"
                onChange={() => setIsNicknameChecked(false)}
              />
              <CheckButton type="button" onClick={checkNickname}>
                중복확인
              </CheckButton>
            </NicknameGroup>
            {nicknameSuccessMessage && <SuccessMessage>{nicknameSuccessMessage}</SuccessMessage>}
            {nicknameErrorMessage && <ErrorMessage>{nicknameErrorMessage}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>국적</Label>
            <CountrySelect
              value={watch('nationality')}
              onChange={(value) => setValue('nationality', value)}
              error={errors.nationality?.message}
            />
          </FormGroup>

          <FormGroup>
            <Label>모국어</Label>
            <Select
              {...register('nativeLanguage', {
                required: '모국어를 선택해주세요.',
              })}
            >
              <option value="">모국어 선택</option>
              <option value="ko">한국어</option>
              <option value="en">영어</option>
              <option value="ja">일본어</option>
              <option value="zh">중국어</option>
            </Select>
            {errors.nativeLanguage && <ErrorMessage>{errors.nativeLanguage.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>관심언어</Label>
            <Select
              {...register('targetLanguage', {
                required: '관심언어를 선택해주세요.',
              })}
            >
              <option value="">관심언어 선택</option>
              <option value="ko">한국어</option>
              <option value="en">영어</option>
              <option value="ja">일본어</option>
              <option value="zh">중국어</option>
            </Select>
            {errors.targetLanguage && <ErrorMessage>{errors.targetLanguage.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>회화수준</Label>
            <Select
              {...register('proficiencyLevel', {
                required: '회화수준을 선택해주세요.',
              })}
            >
              <option value="">회화수준 선택</option>
              <option value="beginner">초급</option>
              <option value="intermediate">중급</option>
              <option value="advanced">고급</option>
            </Select>
            {errors.proficiencyLevel && <ErrorMessage>{errors.proficiencyLevel.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>관심사 태그</Label>
            <TagInput
              value={watch('interests')}
              onChange={(tags) => setValue('interests', tags)}
              maxTags={10}
              minTags={3}
              error={errors.interests?.message}
            />
          </FormGroup>

          <Agreement>
            <input
              type="checkbox"
              {...register('agreement', {
                required: '이용약관에 동의해주세요.',
              })}
            />
            <span>전체 동의</span>
          </Agreement>

          <Agreement>
            <input type="checkbox" required />
            <span>[필수] 만 14세 이상 이용자, 서비스 이용 약관, 개인정보 수집 및 이용 동의</span>
          </Agreement>

          <SubmitButton type="submit" disabled={!isValid || !isNicknameChecked}>
            회원가입
          </SubmitButton>
        </Form>
      </PageContainer>
    </>
  );
}

export default SignupForm;
