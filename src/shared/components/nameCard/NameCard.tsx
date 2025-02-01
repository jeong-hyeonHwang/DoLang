import { css } from '@emotion/react';
import 'flag-icons/css/flag-icons.min.css';
import { useUserQuery } from '../../hooks/useUserQuery';
import { NameCardProps } from '../../types/NameCardProps.interface';
import { useAuth } from '../../hooks/useAuth';

const NameCard = ({ children, style }: NameCardProps) => {
  const { data: userInfo, isLoading, error } = useUserQuery();
  const { loginMutation } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user info</div>;

  const nameCardStyle = css`
    display: flex;
    padding: 10px;
    align-items: center;
    gap: 1rem;
    height: 3.2rem;
    font-weight: semibold;
    font-size: 1.2rem;
    border: ${style?.border ?? '1px solid #cacaca'};
    border-radius: 10px;
    position: relative;
    background-color: ${style?.backgroundColor ?? 'white'};
    ${style && Object.entries(style).reduce((acc, [key, value]) => `${acc}${key}:${value};`, '')};
  `;

  const userInfoStyle = css`
    display: flex;
    align-items: center;
    gap: 1rem;
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
          {userInfo?.userFlag && <span className={`fi fi-${userInfo.userFlag}`} css={flagStyle} />}
        </div>
        <strong>{children || userInfo?.userName}</strong>
      </div>
    );
  };

  const Guest = () => {
    return <div onClick={() => loginMutation.mutate()}>로그인</div>;
  };

  return (
    <div className="name-card" css={nameCardStyle}>
      {userInfo?.userName ? <LoggedInUser /> : <Guest />}
    </div>
  );
};

export default NameCard;
