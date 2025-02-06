import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router';
import NameCard from '../nameCard/NameCard';
import { useUserQuery } from '../../hooks/useUserQuery';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../Logo/Logo';
import GoogleLogout from '@/features/Auth/GoogleLogout';
import { Home, Radio, FileText, User, Settings } from 'lucide-react';

// ── 스타일링 ───────────────────────────────────────────────
const sidebarStyle = css`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  left: 0;
  top: 0;
  height: 100%;
  width: 220px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const navStyle = css`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
  text-align: start;
`;

const linkStyle = css`
  font-size: 18px;
  padding: 10px;
  flex-grow: 1;
  text-decoration: none;
  &:hover {
    color: #007bff;
  }
`;

const subLinkStyle = css`
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  > a {
    font-size: 14px;
  }
`;

const activeLinkStyle = css`
  font-weight: bold;
`;

const extraButtonsContainerStyle = css`
  margin-top: auto;
  padding: 20px;
  text-align: center;
  cursor: pointer;
`;

// ── NavLinks 컴포넌트 ───────────────────────────────
interface LinkItem {
  key: string;
  href: string;
  title: string;
  children?: LinkItem[];
}

interface NavLinksProps {
  linkItems: LinkItem[];
}

const NavLinks = ({ linkItems }: NavLinksProps) => {
  const location = useLocation();

  return (
    <nav css={navStyle}>
      {linkItems.map((item) => {
        const isActive = location.pathname === item.href;

        return (
          <div key={item.key}>
            <Link to={item.href} css={[linkStyle, isActive && activeLinkStyle]}>
              {item.title}
            </Link>

            {isActive && item.children && (
              <div css={subLinkStyle}>
                {item.children.map((child) => (
                  <Link
                    to={child.href}
                    key={child.key}
                    css={[linkStyle, location.pathname === child.href && activeLinkStyle]}
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

const linkItems: LinkItem[] = [
  { key: '1', href: '/', title: '메인' },
  { key: '2', href: '/feed', title: '피드' },
  {
    key: '3',
    href: '/savedContents',
    title: '내 기록',
    children: [
      { key: '3-1', href: '/savedContents/bookmark', title: '북마크' },
      { key: '3-2', href: '/savedContents/calls', title: '음성기록' },
      { key: '3-3', href: '/savedContents/feed', title: '내 피드' },
    ],
  },
  { key: '4', href: '/profile', title: '프로필' },
];

export const NavBarContainer = () => {
  const { logoutMutation } = useAuth();
  const { data: userInfo, isLoading } = useUserQuery();

  return (
    <div css={sidebarStyle}>
      <Logo />
      <NameCard style={{ border: 'none', backgroundColor: 'transparent' }} />
      <NavLinks linkItems={linkItems} />

      <div css={extraButtonsContainerStyle}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>{userInfo?.userName && <div onClick={() => logoutMutation.mutate()}>로그아웃</div>}</div>
        )}
      </div>
      <GoogleLogout />
    </div>
  );
};
