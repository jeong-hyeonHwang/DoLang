import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { userState } from '../../../features/Auth/userState';
import styled from '@emotion/styled';
import CountryPicker from '../../../shared/components/Picker/CountryPicker';
import LanguagePicker from '../../../shared/components/Picker/LanguagePicker';
import ProficiencyLevelPicker from '../../../shared/components/Picker/ProficiencyLevelPicker';
import TagInput from '../../../shared/components/Tag/TagInput';
import { userPut } from '../../../api/utils/user_put';
import languages from '../../../shared/components/Picker/languages.json';
import countries from '../../../shared/components/Picker/countries.json';
import proficiencyLevel from '../../../shared/components/Picker/proficiencyLevel.json';

type Interest = {
  tagId: number;
  nativeLanguageId: string;
  tagName: string;
};

interface UserProfileData {
  nickname: string;
  nationality: string;
  nativeLanguage: string;
  targetLanguage: string;
  proficiencyLevel: string;
  interests: Interest[];
  profileImageUrl: string;
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
  max-width: 800px;
  min-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #212529;
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
  font-size: 16px;
  color: #495057;
  text-align: left;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const ErrorMessage = styled.span`
  color: #e03131;
  font-size: 14px;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #43a047;
  }
`;

const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 4px solid #e9ecef;
`;

const ImageUploadButton = styled.label`
  padding: 0.5rem 1rem;
  background-color: #495057;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #343a40;
  }
`;

function UserProfile() {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('/placeholder.svg');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, [setUser]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UserProfileData>({
    defaultValues: user || {
      nickname: '',
      nationality: '',
      nativeLanguage: '',
      targetLanguage: '',
      proficiencyLevel: '',
      interests: [],
      profileImageUrl: '/placeholder.svg',
    },
  });

  useEffect(() => {
    // user 값이 변할 때마다 reset 호출
    if (user) {
      reset({
        nickname: user.nickname ?? '',
        nationality: user.nationality ?? '',
        nativeLanguage: user.nativeLanguage ?? '',
        targetLanguage: user.targetLanguage ?? '',
        proficiencyLevel: user.proficiencyLevel ?? '',
        interests: user.interests ?? [],
        profileImageUrl: user.profileImageUrl ?? '',
        // profileImageUrl: user.profileImageUrl ?? '/placeholder.svg',
      });
      setProfileImageUrl(user.profileImageUrl ?? '');
    }
  }, [user, reset]);

  // 프로필 이미지 업로드 처리
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

  // 프로필 업데이트 요청
  const onSubmit = async (data: UserProfileData) => {
    setLoading(true); // 로딩 시작
    try {
      const res = await userPut(data);
      if (res) {
        alert('프로필이 성공적으로 업데이트되었습니다.');
        setUser(data);
        sessionStorage.setItem('user', JSON.stringify(data));
      } else {
        throw new Error('업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생: ', error);
      alert('업데이트에 실패했습니다.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <PageContainer>
      <Title>사용자 프로필</Title>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ProfileImageContainer>
          <ProfileImage src={profileImageUrl} alt="Profile" />
          <ImageUploadButton>
            프로필 사진 변경
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          </ImageUploadButton>
        </ProfileImageContainer>

        <FormGroup>
          <Label>닉네임</Label>
          <Input {...register('nickname', { required: '닉네임을 입력해주세요.' })} />
          {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <RowContainer>
            <FormItem>
              <Label>국적</Label>
              <Controller
                name="nationality"
                control={control}
                rules={{ required: '국적을 선택해주세요.' }}
                render={({ field }) => <CountryPicker {...field} />}
              />
              {errors.nationality && <ErrorMessage>{errors.nationality.message}</ErrorMessage>}
            </FormItem>
            <FormItem>
              <Label>모국어</Label>
              <Controller
                name="nativeLanguage"
                control={control}
                rules={{ required: '모국어를 선택해주세요.' }}
                render={({ field }) => <LanguagePicker {...field} />}
              />
              {errors.nativeLanguage && <ErrorMessage>{errors.nativeLanguage.message}</ErrorMessage>}
            </FormItem>
          </RowContainer>
        </FormGroup>

        <FormGroup>
          <RowContainer>
            <FormItem>
              <Label>관심언어</Label>
              <Controller
                name="targetLanguage"
                control={control}
                rules={{ required: '관심언어를 선택해주세요.' }}
                render={({ field }) => <LanguagePicker {...field} />}
              />
              {errors.targetLanguage && <ErrorMessage>{errors.targetLanguage.message}</ErrorMessage>}
            </FormItem>
            <FormItem>
              <Label>회화수준</Label>
              <Controller
                name="proficiencyLevel"
                control={control}
                rules={{ required: '회화수준을 선택해주세요.' }}
                render={({ field }) => <ProficiencyLevelPicker {...field} />}
              />
              {errors.proficiencyLevel && <ErrorMessage>{errors.proficiencyLevel.message}</ErrorMessage>}
            </FormItem>
          </RowContainer>
        </FormGroup>

        <FormGroup>
          <Label>관심사 태그</Label>
          <Controller
            name="interests"
            control={control}
            rules={{ required: '최소 3개의 관심사를 입력해주세요.' }}
            render={({ field }) => {
              const mappedIterests = field.value.map((interest: Interest) => interest.tagName);
              return (
                <TagInput
                  {...field}
                  value={mappedIterests}
                  maxTags={10}
                  minTags={3}
                  error={errors.interests?.message}
                />
              );
            }}
          />
        </FormGroup>

        <SubmitButton type="submit">프로필 업데이트</SubmitButton>
      </Form>
    </PageContainer>
  );
}

export default UserProfile;
