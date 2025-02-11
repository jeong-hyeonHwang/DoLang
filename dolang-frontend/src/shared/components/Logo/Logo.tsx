import React from 'react';
import { css } from '@emotion/react';
import logoImage from '@/assets/doLangLogo.png';

const logoContainerStyle = css`
  margin: 0 auto;
  width: 140px;
  height: 50px;
`;

const logoStyle = css`
  color: var(--logo-color);
  width: 100%;
  height: 100%;
`;

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

const Logo: React.FC<LogoProps> = ({ className, style }) => (
  <div css={logoContainerStyle} className={className} style={style}>
    <img className="LogoImage" src={logoImage} css={logoStyle} alt="Logo" />
  </div>
);
export default Logo;
