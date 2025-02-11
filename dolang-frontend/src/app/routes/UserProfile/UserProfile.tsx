import type React from 'react';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useForm, Controller } from 'react-hook-form';
import CountryPicker from '../../../shared/components/Picker/CountryPicker';
import LanguagePicker from '../../../shared/components/Picker/LanguagePicker';
import ProficiencyLevelPicker from '../../../shared/components/Picker/ProficiencyLevelPicker';
import TagInput from '../../../shared/components/Tag/TagInput';
import languages from '../../../shared/components/Picker/languages.json';
import countries from '../../../shared/components/Picker/countries.json';
import proficiencyLevel from '../../../shared/components/Picker/proficiencyLevel.json';

interface UserProfileData {
  nickname: string;
  nationality: string;
  nativeLanguage: string;
  targetLanguage: string;
  proficiencyLevel: string;
  interests: string[];
  profileImage: string;
}
const getLanguageLabel = (code: string) => {
  const language = languages.find((lang) => lang.value === code);
  return language ? language.label : '알 수 없음';
};
const getFlagEmoji = (code: string) => {
  const language = languages.find((lang) => lang.value === code);
  return language ? `🇨🇭` : '';
};
const getProficiencyLabel = (code: string) => {
  const proficiency = proficiencyLevel.find((level) => level.value === code);
  return proficiency ? proficiency.label : '알 수 없음';
};
const getCountryLabel = (code: string) => {
  const country = countries.find((coun) => coun.value === code);
  return country ? country.label : '알 수 없음';
};

const PageContainer = styled.div`
  background-color: #ffffff;
  width: 90%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  /* border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #1a1a1a;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
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

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #242424;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5f5f5f;
  }
`;

const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const ImageUploadButton = styled.label`
  padding: 0.5rem 1rem;
  background-color: #4b5563;
  color: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #6b7280;
  }
`;

function UserProfile() {
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UserProfileData>({
    defaultValues: {
      nickname: '홍길동',
      nationality: 'ko',
      nativeLanguage: 'ko',
      targetLanguage: 'en',
      proficiencyLevel: 'b1',
      interests: ['Coding', 'Gaming', 'Music'],
      profileImage: '/default-profile.png',
    },
  });

  //   useEffect(() => {
  // 백엔드 연결
  //     const fetchUserData = async () => {
  //       const response = await fetch('/api/user-profile');
  //       const userData = await response.json();

  //       setValue('nickname', userData.nickname);
  //       setValue('nationality', userData.nationality);
  //       setValue('nativeLanguage', userData.nativeLanguage);
  //       setValue('targetLanguage', userData.targetLanguage);
  //       setValue('proficiencyLevel', userData.proficiencyLevel);
  //       setValue('interests', userData.interests);
  //       setProfileImageUrl(userData.profileImage);
  //     };

  //     fetchUserData();
  //   }, [setValue]);

  //   const onSubmit = async (data: UserProfileData) => {
  //     try {
  //       const response = await fetch('/api/update-profile', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ ...data, profileImage: profileImageUrl }),
  //       });

  //       if (response.ok) {
  //         alert('프로필이 성공적으로 업데이트되었습니다.');
  //       } else {
  //         throw new Error('프로필 업데이트에 실패했습니다.');
  //       }
  //     } catch (error) {
  //       console.error('Error updating profile:', error);
  //       alert('프로필 업데이트 중 오류가 발생했습니다.');
  //     }
  //   };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <PageContainer>
      <Title>사용자 프로필</Title>
      {/* <Form onSubmit={handleSubmit(onSubmit)}> */}
      <Form>
        <ProfileImageContainer>
          <ProfileImage src={profileImageUrl || '/placeholder.svg'} alt="Profile" />
          <ImageUploadButton>
            프로필 사진 변경
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            {/* <input type="file" accept="image/*" style={{ display: 'none' }} /> */}
          </ImageUploadButton>
        </ProfileImageContainer>

        <FormGroup>
          <Label>닉네임</Label>
          <Input {...register('nickname', { required: '닉네임을 입력해주세요.' })} />
          {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>국적</Label>
          <Controller
            name="nationality"
            control={control}
            rules={{ required: '국적을 선택해주세요.' }}
            render={({ field }) => <CountryPicker {...field} />}
          />
          {errors.nationality && <ErrorMessage>{errors.nationality.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>모국어</Label>
          <Controller
            name="nativeLanguage"
            control={control}
            rules={{ required: '모국어를 선택해주세요.' }}
            render={({ field }) => <LanguagePicker {...field} />}
          />
          {errors.nativeLanguage && <ErrorMessage>{errors.nativeLanguage.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>관심언어</Label>
          <Controller
            name="targetLanguage"
            control={control}
            rules={{ required: '관심언어를 선택해주세요.' }}
            render={({ field }) => <LanguagePicker {...field} />}
          />
          {errors.targetLanguage && <ErrorMessage>{errors.targetLanguage.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>회화수준</Label>
          <Controller
            name="proficiencyLevel"
            control={control}
            rules={{ required: '회화수준을 선택해주세요.' }}
            render={({ field }) => <ProficiencyLevelPicker {...field} />}
          />
          {errors.proficiencyLevel && <ErrorMessage>{errors.proficiencyLevel.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>관심사 태그</Label>
          <Controller
            name="interests"
            control={control}
            rules={{ required: '최소 3개의 관심사를 입력해주세요.' }}
            render={({ field }) => <TagInput {...field} maxTags={10} minTags={3} error={errors.interests?.message} />}
          />
        </FormGroup>

        <SubmitButton type="submit">프로필 업데이트</SubmitButton>
      </Form>
    </PageContainer>
  );
}

export default UserProfile;
