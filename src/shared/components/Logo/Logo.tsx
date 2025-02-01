import { css } from '@emotion/react';
import logoImage from '../../../assets/DoLangLogo.png';

const Logo = () => (
  <div>
    <img className="LogoImage" src={logoImage} alt="Logo" width={140} height={50} />
  </div>
);
export default Logo;
