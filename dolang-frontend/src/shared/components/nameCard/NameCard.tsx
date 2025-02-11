import { useRecoilState } from 'recoil';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { css } from '@emotion/react';
import 'flag-icons/css/flag-icons.min.css';
import { NameCardProps } from '../../types/NameCardProps.interface.ts';
import { userGet } from '../../../api/utils/user_get.ts';
import { userState } from '../../../features/Auth/userState.ts';

const NameCard = ({ userNickname, style }: NameCardProps) => {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useRecoilState(userState);
  const navigate = useNavigate();

  const mockUser = {
    nickname: '홍길동',
    nationality: 'kr',
    nativeLanguage: 'kr',
    targetLanguage: 'en',
    proficiencyLevel: 'a1',
    interests: [4, 5],
    // profileImageUrl: '',
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userGet();
        console.log('resCard: ', response);
        setUser(response.result?.nickname ? response : mockUser);
      } catch (error) {
        setError('사용자 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, setUserData]);

  const randomBgColor = useMemo(() => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const nameCardStyle = css`
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 3.2rem;
    font-weight: semibold;
    font-size: 1.2rem;
    border: ${style === 'compact' ? 'none' : style === 'bordered' ? '1px solid #cacaca' : 'none'};
    border-radius: 10px;
    position: relative;
    margin-bottom: 0.6rem;
    margin-right: 0.4rem;
  `;

  const userInfoStyle = css`
    display: flex;
    align-items: center;
    gap: 1rem;
  `;
  const nameStyle = css`
    ${style === 'compact' && 'display: none'};
    white-space: nowrap;
  `;

  const userImageStyle = css`
    background-color: ${user?.profileImageUrl ? 'transparent' : randomBgColor};
    display: flex;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    position: relative;
  `;

  const flagStyle = css`
    position: absolute;
    right: -4px;
    bottom: 0;
    z-index: 1;
    font-size: 1rem;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);
  `;

  const LoggedInUser = () => {
    return (
      <div className="user-info" css={userInfoStyle}>
        <div className="user-image-wrapper" css={userImageStyle}>
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="User profile"
              css={css`
                width: 100%;
                height: 100%;
                border-radius: 50%;
                box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
              `}
            />
          ) : (
            <div
              css={css`
                width: 100%;
                height: 100%;
                background-color: ${randomBgColor};
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                color: white;
                font-weight: bold;
                font-size: 1.2rem;
                box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
              `}
            >
              {user?.nickname?.charAt(0).toUpperCase()}
            </div>
          )}
          {user?.nationality && <span className={`fi fi-${user.nationality}`} css={flagStyle} />}
        </div>
        <div
          css={css`
            ${nameStyle};
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
          `}
        >
          <strong>{user?.nickname || userNickname}</strong>
        </div>
      </div>
    );
  };

  return (
    <div className="name-card" css={nameCardStyle}>
      {user ? <LoggedInUser /> : null}
    </div>
  );
};

export default NameCard;
