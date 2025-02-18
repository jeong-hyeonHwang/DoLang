import React from 'react';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { userState } from '../../../features/Auth/userState';
import styled from '@emotion/styled';
import CountryPicker from '../../../shared/components/Picker/CountryPicker';
import LanguagePicker from '../../../shared/components/Picker/LanguagePicker';
import ProficiencyLevelPicker from '../../../shared/components/Picker/ProficiencyLevelPicker';
import TagInput from '../../../shared/components/Tag/TagInput';
import { userGet } from '@/api/utils/useUser';
import { userPut } from '../../../api/utils/user_put';
import languages from '../../../shared/components/Picker/languages.json';
import countries from '../../../shared/components/Picker/countries.json';
import proficiencyLevel from '../../../shared/components/Picker/proficiencyLevel.json';
import Cookies from 'js-cookie';

type Interest = {
  tagId?: number;
  name?: string;
};

export interface UserProfileData {
  nickname: string;
  nationality: string;
  nativeLanguage: string;
  targetLanguage: string;
  proficiencyLevel: string;
  interests: Interest[];
  profileImageUrl?: string;
  profileImage?: File | string;
}

const PageContainer = styled.div`
  background-color: #ffffff;
  max-width: 800px;
  min-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
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
  padding: 20px;
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
  /* align-items: center; */
`;

const RowContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: space-between;
  padding: 10px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 16px;
  color: #495057;
  text-align: left;
  margin-bottom: 10px;
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
  &:disabled {
    background-color: #5f5f5f;
  }

  &:disabled {
    cursor: not-allowed;
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
  const [profileImageUrl, setProfileImageUrl] = useState<string>('default-user.png');
  const [profileImage, setProfileImage] = useState<File | string>();

  const accessToken = Cookies.get('access_token');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
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
      profileImageUrl: 'default-user.png',
      profileImage: '',
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await userGet(accessToken);
        if (storedUser) {
          setUser(storedUser.result);

          reset({
            nickname: storedUser.result.nickname ?? '',
            nationality: storedUser.result.nationality ?? '',
            nativeLanguage: storedUser.result.nativeLanguage ?? '',
            targetLanguage: storedUser.result.targetLanguage ?? '',
            proficiencyLevel: storedUser.result.proficiencyLevel ?? '',
            interests: storedUser.result.interests ?? [],
            profileImageUrl: storedUser.result.profileImageUrl ?? 'default-user.png',
            profileImage: storedUser.result.profileImageUrl || '',
          });
          setProfileImageUrl(storedUser.result.profileImageUrl ?? 'default-user.png');
        }
      } catch (error) {
        console.error('failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [accessToken, reset, setUser]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setProfileImage(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: UserProfileData) => {
    setLoading(true);
    try {
      const formattedInterest = {
        ...data,
        interests: data.interests.map((value) => value.tagId),
      };

      if ((data.nativeLanguage ?? user?.nativeLanguage) === (data.targetLanguage ?? user?.targetLanguage)) {
        alert('모국어와 관심언어 설정을 다르게 해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('nickname', data.nickname);
      formData.append('nationality', data.nationality);
      formData.append('nativeLanguage', data.nativeLanguage);
      formData.append('targetLanguage', data.targetLanguage);
      formData.append('proficiencyLevel', data.proficiencyLevel);
      formData.append('profileImageUrl', 'default-user.png');
      formData.append('interests', formattedInterest.interests.join(', '));

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const userPutData: UserProfileData = {
        nickname: data.nickname,
        nationality: data.nationality,
        nativeLanguage: data.nativeLanguage,
        targetLanguage: data.targetLanguage,
        proficiencyLevel: data.proficiencyLevel,
        interests: formattedInterest.interests,
        profileImageUrl: 'default-user.png',
        profileImage: profileImage,
      };
      const res = await userPut(formData, accessToken);
      if (res.code === 200) {
        alert('프로필이 성공적으로 업데이트되었습니다.');
        const res = await userGet(accessToken);
        setUser(res.result);
        sessionStorage.setItem('user', JSON.stringify(res.result));
      } else {
        throw new Error('업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 업데이트 중 오류 발생: ', error);
      alert('업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Title>사용자 프로필</Title>
      <Form>
        <ProfileImageContainer>
          <ProfileImage
            src={
              profileImage instanceof File ? URL.createObjectURL(profileImage) : profileImageUrl || 'default-user.png'
            }
            alt="Profile"
          />
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
                render={({ field }) => {
                  return <CountryPicker {...field} disabled={true} />;
                }}
              />
              {errors.nationality && <ErrorMessage>{errors.nationality.message}</ErrorMessage>}
            </FormItem>
            <FormItem>
              <Label>모국어</Label>
              <Controller
                name="nativeLanguage"
                control={control}
                rules={{ required: '모국어를 선택해주세요.' }}
                render={({ field }) => <LanguagePicker {...field} disabled={true} />}
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
                render={({ field }) => {
                  return <ProficiencyLevelPicker {...field} />;
                }}
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
              const tagNames = Array.isArray(field.value)
                ? field.value.map((interest: Interest | string, index) => {
                    if (typeof interest === 'string') {
                      return { tagId: index, name: interest };
                    } else if (interest && typeof interest === 'object') {
                      return {
                        tagId: interest.tagId ?? index,
                        name: interest.name ?? interest?.tagName ?? '',
                      };
                    }
                    return { tagId: index, name: '' };
                  })
                : [];

              return (
                <TagInput
                  {...field}
                  value={tagNames}
                  maxTags={10}
                  minTags={3}
                  error={errors.interests?.message}
                  nativeLanguageId={user?.nativeLanguage}
                  onChange={(tags) => {
                    const formattedTags = tags
                      .filter((tag) => tag !== undefined && tag !== null)
                      .map((tag) => {
                        return { tagId: tag.tagId, name: tag.name };
                      });
                    field.onChange(formattedTags);
                  }}
                />
              );
            }}
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={watch('interests')?.length < 3} onClick={handleFormSubmit}>
          프로필 업데이트
        </SubmitButton>
      </Form>
    </PageContainer>
  );
}

export default UserProfile;
