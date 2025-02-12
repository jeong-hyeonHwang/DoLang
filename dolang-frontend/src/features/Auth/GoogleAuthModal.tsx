import React from 'react';
import { css } from '@emotion/react';
import Logo from '../../shared/components/Logo/Logo';

interface GoogleLoginButtonProps {
  onLoginClick: () => void;
}

const cardStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* width: 100%; */
`;

const mainStyle = css`
  flex-grow: 1;
  padding: 1.33rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const headerStyle = css`
  display: flex;
  align-items: center;
  min-height: 5rem;
  height: 5rem;
  margin-left: 1.33rem;
`;

const fontStyle = (fontSize: string) => css`
  font-size: ${fontSize};
  font-family: 'Noto Sans KR, sans-serif';
`;

const buttonStyle = (bgColor: string, textColor: string, hoverColor: string) => css`
  background-color: ${bgColor};
  color: ${textColor};
  border: none;
  width: 250px;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 30px;
  transition: background-color 0.3 ease;
  margin-bottom: 10px;

  &:hover {
    background-color: ${hoverColor};
  }
`;

const iconStyle = css`
  position: relative;
  display: inline-block;
  justify-content: center;
  align-items: center;
  width: 1.667rem;
  height: 1.667rem;
  vertical-align: middle;
`;

const consoleCheck = () => {
  console.log('button Click');
};

// css={buttonStyle('#FEE500', 'black', '#E4C700')}
// const GoogleLoginModal: React.FC<GoogleLoginButtonProps> = ({ onLoginClick }) => {
function GoogleAuthModal({ onLoginClick }: GoogleLoginButtonProps) {
  return (
    <>
      <div css={cardStyle}>
        <main css={mainStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Logo style={{ width: '180px', height: '64px', marginTop: '1.2rem' }} />

            {/* <h1 css={fontStyle('35px')} style={{ marginTop: '0.5rem' }}>
              Login
            </h1> */}
            <p style={{ marginTop: '2rem', marginBottom: '2.5rem' }} css={fontStyle('20px')}>
              {/* Log in to your account */}
              Use your Google Account
            </p>
          </div>

          <div>
            <button
              style={{ border: '1px solid #a0a0a0', boxShadow: '0 2px 2px rgba(0, 0, 0, 0.2)', marginBottom: '2rem' }}
              css={buttonStyle('#Ffffff', 'black', '#f5f5f5')}
              onClick={onLoginClick}
            >
              <div css={iconStyle} style={{ marginBottom: '0.2rem' }}>
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#4285F4"
                    d="M23.5 12.5c2.5 0 4.8.9 6.6 2.3l4.9-4.8C31.6 7 27.8 5.5 23.5 5.5 14.8 5.5 7.5 11.8 5.1 20h6.1c1.9-5 6.6-7.5 12.3-7.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M5.1 20c-.3 1.2-.6 2.5-.6 3.9s.2 2.7.6 4h6.1c-.4-1.3-.6-2.6-.6-4s.2-2.7.6-3.9H5.1z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M23.5 34.5c-5.7 0-10.4-2.5-12.3-7.5h-6.1c2.4 8.2 9.7 14.5 18.4 14.5 4.3 0 8.1-1.4 11.5-3.8l-5.2-4.3c-1.8 1.1-4 1.8-6.3 1.8z"
                  />
                  <path
                    fill="#EA4335"
                    d="M41.5 20H24v7.5h10.3c-.6 3-2.7 5.4-5.5 6.9l5.2 4.3c4.9-3.6 7.5-9 7.5-15.7 0-1.3-.1-2.5-.3-3.7z"
                  />
                </svg>
              </div>
              <p css={fontStyle('16px')} style={{ margin: '0' }}>
                Google로 시작하기
              </p>
            </button>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p css={fontStyle('16px')} style={{ margin: '8px' }}>
                매일 새로운 주제
              </p>
              <p css={fontStyle('16px')} style={{ margin: '8px' }}>
                매일 색다른 대화
              </p>
            </span>
          </div>
        </main>
      </div>
    </>
  );
}
export default GoogleAuthModal;
