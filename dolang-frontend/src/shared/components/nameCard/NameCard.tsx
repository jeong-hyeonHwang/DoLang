import { css } from '@emotion/react';
import 'flag-icons/css/flag-icons.min.css';
import { useAuth } from '../../hooks/useAuth.ts';
import { NameCardProps } from '../../types/NameCardProps.interface.ts';

const NameCard = ({ userCountry, userNickname, style }: NameCardProps) => {
  // const { data: user, isLoading, error } = useUserQuery();
  const { loginMutation } = useAuth();

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error loading user info</div>;

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
    background-color: black;
    display: flex;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    position: relative;
  `;

  const flagStyle = css`
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 1;
    font-size: 1rem;
  `;

  const LoggedInUser = () => {
    return (
      <div className="user-info" css={userInfoStyle}>
        <div className="user-image-wrapper" css={userImageStyle}>
          {userCountry && <span className={`fi fi-${userCountry}`} css={flagStyle} />}
        </div>
        <div css={nameStyle}>
          <strong>{userNickname}</strong>
        </div>
      </div>
    );
  };

  const Guest = () => {
    return <div onClick={() => loginMutation.mutate()}>로그인</div>;
  };

  return (
    <div className="name-card" css={nameCardStyle}>
      {userNickname ? <LoggedInUser /> : <Guest />}
    </div>
  );
};

export default NameCard;
