import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import styled from '@emotion/styled';
import { useForm, Controller } from 'react-hook-form';
import CountryPicker from '../../shared/components/Picker/CountryPicker';
import LanguagePicker from '../../shared/components/Picker/LanguagePicker';
import ProficiencyLevelPicker from '../../shared/components/Picker/ProficiencyLevelPicker';
import TagInput from '../../shared/components/Tag/TagInput';
import { userPost } from '../../api/utils/user_post';
import { useRecoilState } from 'recoil';
import { authState } from './authState';
import { userState } from './userState';
import type { User } from '../../shared/types/UserInfo.type';

type Interest = {
  id: number;
  nativeLanguageId: string;
  name: string;
};
interface SignupFormData {
  nickname: string;
  nationality: string;
  nativeLanguage: string;
  targetLanguage: string;
  proficiencyLevel: string;
  interests: Interest[];
  agreement: boolean;
  profileImageUrl?: string;
}

const PageContainer = styled.div`
  background-color: #ffffff;
  width: 90%;
  min-width: 320px;
  min-height: 700px;
  margin: 0 2rem 2rem;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 4rem;
  color: #1a1a1a;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 600px;
  justify-content: space-evenly;
  align-items: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 500px;
`;

const FormItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RowContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`;

const Label = styled.label`
  font-weight: bold;
  text-align: left;
  font-size: 1rem;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const CheckButton = styled.button<{ isEmpty: boolean }>`
  background-color: ${(props) => (props.isEmpty ? '#d1d5db' : '#242424')};
  color: white;
  border-radius: 0.375rem;
  padding: 0.75rem;
  border: none;
  font-size: 1rem;

  &:hover {
    background-color: ${(props) => !props.isEmpty && '#5f5f5f'};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.span`
  color: #1c37ff;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  margin-bottom: 2rem;
  background-color: ${(props) => (props.disabled ? '#d1d5db' : '#242424')};
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:not(:disabled) {
    &:hover {
      background-color: #5f5f5f;
    }
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

function SignupForm() {
  const [nickname, setNickname] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
  const [nicknameSuccessMessage, setNicknameSuccessMessage] = useState('');
  const [auth, setAuth] = useRecoilState(authState);
  const [user, setUser] = useRecoilState(userState);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      nationality: '',
      nativeLanguage: '',
      targetLanguage: '',
      proficiencyLevel: '',
      interests: [],
      agreement: false,
      profileImageUrl: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    if (!isNicknameChecked) {
      setNicknameErrorMessage('닉네임 중복 확인이 필요합니다.');
      return;
    }

    try {
      const response = await userPost(data);
      console.log('Userdata: ', response);
      if (response.status === 200) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          user: response.data,
          isLoggedIn: true,
        }));

        setUser(userData);
        alert('회원가입이 완료되었습니다!');
        sessionStorage.setItem('isLoggedIn', JSON.stringify(true));
        navigate('/');
      } else {
        throw new Error('회원가입 실패');
      }
    } catch (error) {
      alert(`회원가입을 다시 시도해주세요. ${error}`);
    }
  };

  const checkNickname = () => {
    const nicknameValue = nickname;
    if (!nicknameValue) {
      setNicknameErrorMessage('닉네임을 입력해주세요.');
      return;
    }

    // 닉네임 중복확인 호출 (예정)
    const isAvailable = nicknameValue !== 'test';

    if (isAvailable) {
      setIsNicknameChecked(true);
      setNicknameSuccessMessage('사용 가능한 닉네임입니다.');
      setNicknameErrorMessage('');
    } else {
      setIsNicknameChecked(false);
      setNicknameSuccessMessage('');
      setNicknameErrorMessage('이미 사용 중인 닉네임입니다.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <PageContainer>
        <Title>회원가입</Title>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>닉네임</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem' }}>
              <Input
                {...register('nickname', { required: '닉네임을 입력해주세요.' })}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임 설정"
              />
              <CheckButton type="button" onClick={checkNickname} isEmpty={!nickname}>
                중복확인
              </CheckButton>
            </div>
            {nicknameSuccessMessage && <SuccessMessage>{nicknameSuccessMessage}</SuccessMessage>}
            {nicknameErrorMessage && <ErrorMessage>{nicknameErrorMessage}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <RowContainer>
              <FormItem>
                <Label style={{ marginBottom: '5px' }}>국적</Label>
                <Controller
                  name="nationality"
                  control={control}
                  rules={{ required: '국적을 선택해주세요.' }}
                  render={({ field }) => <CountryPicker {...field} onChange={(value) => field.onChange(value)} />}
                />
                {errors.nationality && <ErrorMessage>{errors.nationality.message}</ErrorMessage>}
              </FormItem>
              <FormItem>
                <Label>모국어</Label>
                <Controller
                  name="nativeLanguage"
                  control={control}
                  rules={{ required: '모국어를 선택해주세요.' }}
                  render={({ field }) => <LanguagePicker {...field} onChange={(value) => field.onChange(value)} />}
                />
                {errors.nativeLanguage && <ErrorMessage>{errors.nativeLanguage.message}</ErrorMessage>}
              </FormItem>
            </RowContainer>
          </FormGroup>

          <FormGroup>
            <RowContainer>
              <FormItem>
                <Label style={{ marginBottom: '5px' }}>관심언어</Label>
                <Controller
                  name="targetLanguage"
                  control={control}
                  rules={{ required: '관심언어를 선택해주세요.' }}
                  render={({ field }) => <LanguagePicker {...field} onChange={(value) => field.onChange(value)} />}
                />
                {errors.targetLanguage && <ErrorMessage>{errors.targetLanguage.message}</ErrorMessage>}
              </FormItem>
              <FormItem>
                <Label>회화수준</Label>
                <Controller
                  name="proficiencyLevel"
                  control={control}
                  rules={{ required: '회화수준을 선택해주세요.' }}
                  render={({ field }) => (
                    <ProficiencyLevelPicker {...field} onChange={(value) => field.onChange(value)} />
                  )}
                />
                {errors.proficiencyLevel && <ErrorMessage>{errors.proficiencyLevel.message}</ErrorMessage>}
              </FormItem>
            </RowContainer>
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

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <input type="checkbox" {...register('agreement', { required: '이용약관에 동의해주세요.' })} /> [필수]
              이용약관에 동의합니다.
            </div>
            {errors.agreement && <ErrorMessage>{errors.agreement.message}</ErrorMessage>}
          </div>

          <SubmitButton
            type="submit"
            disabled={
              !isValid ||
              !isNicknameChecked ||
              !watch('nationality') ||
              !watch('nativeLanguage') ||
              !watch('targetLanguage') ||
              !watch('proficiencyLevel') ||
              watch('interests')?.length < 3
            }
          >
            회원가입
          </SubmitButton>
        </Form>
      </PageContainer>
    </div>
  );
}

export default SignupForm;
