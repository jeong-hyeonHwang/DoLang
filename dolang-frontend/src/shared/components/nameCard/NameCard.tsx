import { useRecoilState } from 'recoil';
import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import 'flag-icons/css/flag-icons.min.css';
import { NameCardProps } from '../../types/NameCardProps.interface.ts';
import { userState } from '../../../features/Auth/userState.ts';

const NameCard = ({ userNickname, style }: NameCardProps) => {
  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [setUser]);

  if (loading) return <div>Loading...</div>;

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
    background-color: ${user?.profileImageUrl ? 'transparent' : '#A133FF'};
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

  return (
    <div className="name-card" css={nameCardStyle}>
      {user && (
        <div className="user-info" css={userInfoStyle}>
          <div className="user-image-wrapper" css={userImageStyle}>
            {user.profileImageUrl ? (
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
                  background-color: #a133ff;
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
                {user.nickname?.charAt(0).toUpperCase()}
              </div>
            )}
            {user.nationality && <span className={`fi fi-${user.nationality}`} css={flagStyle} />}
          </div>
          <div css={nameStyle}>
            <strong>{user.nickname || userNickname}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default NameCard;
