import { useState } from 'react';
import { css } from '@emotion/react';
import 'flag-icons/css/flag-icons.min.css';
import { NameCardProps } from '../../types/NameCardProps.interface.ts';
export const NameCard = ({ ...props }: NameCardProps) => {
  const nameCardStyle = css`
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 3.2rem;
    font-weight: semibold;
    font-size: 1.2rem;
    border: ${props.style === 'compact' ? 'none' : props.style === 'bordered' ? '1px solid #cacaca' : 'none'};
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
    ${props.style === 'compact' && 'display: none'};
    white-space: nowrap;
  `;

  return (
    <div className="name-card" css={nameCardStyle}>
      {props.userNickname && (
        <div className="user-info" css={userInfoStyle}>
          <UserImageWrapper
            profileImageUrl={props.userImage}
            userNickname={props.userNickname}
            userCountry={props.userCountry}
          />

          <div css={nameStyle}>
            <strong>{props.userNickname}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export const UserImageWrapper = ({
  profileImageUrl,
  userNickname,
  userCountry,
}: {
  profileImageUrl: string;
  userNickname: string;
  userCountry: string;
}) => {
  const userImageWrapperStyle = css`
    background-color: ${profileImageUrl ? 'transparent' : '#A133FF'};
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

  const userImageStyle = css`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  `;

  return (
    <div className="user-image-wrapper" css={userImageWrapperStyle}>
      {profileImageUrl ? (
        <img src={profileImageUrl} alt="User profile" css={userImageStyle} />
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
          {userNickname?.charAt(0).toUpperCase()}
        </div>
      )}
      {userCountry && <span className={`fi fi-${userCountry}`} css={flagStyle} />}
    </div>
  );
};
