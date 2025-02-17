import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useRecoilState } from 'recoil';
import { authState } from '../../../features/Auth/authState.ts';
import { Link, useLocation } from 'react-router-dom';
import { NameCard } from '../nameCard/NameCard.tsx';
import { useUserQuery } from '../../hooks/useUserQuery.ts';
import Logo from '../Logo/Logo.tsx';
import { Home, Radio, FileText, User, Settings, Check, ChevronUp, ChevronDown } from 'lucide-react';
import GoogleLogout from '../../../features/Auth/GoogleLogout.tsx';

const sidebarStyle = css`
  height: 100vh;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 1rem;
  display: flex;
  position: fixed;
  flex-direction: column;
  height: 100%;
  width: 15rem;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const navStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  padding-left: 20px;
`;

const topSectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const middleSectionStyle = css`
  display: flex;
  flex-direction: column;
  margin-bottom: auto;
`;

const middleSectionStyle2 = css`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 11rem;
`;

const bottomSectionStyle = css`
  text-align: center;
  cursor: pointer;
  margin-top: 20px;
`;

const linkStyle = css`
  font-size: 17px;
  padding: 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  border-radius: 10px;
  color: #333;
  transition: 0.3s ease;

  &:hover {
    background: #7ab9741c;
    color: #2e7d32;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 1.8rem;
  }
`;

const subLinkStyle = css`
  padding-left: 60px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transform: translateY(-3px);
  transition:
    max-height 0.3s ease-out,
    opacity 0.3s ease-out;

  &.open {
    max-height: 200px;
    opacity: 1;
  }

  > a {
    font-size: 14px;
    padding: 8px 10px;
    text-decoration: none;
    white-space: nowrap;
    color: #525252;
    width: 120px;
    margin-top: 5px;
    height: 35px;
    &:hover {
      color: #7ab974;
    }
  }
`;

const bottomLinkStyle = css`
  font-size: 15px;
  justify-content: center;

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 1rem;
  }
`;

const activeLinkStyle = css`
  font-weight: bold;
  color: #2e7d32;
  background-color: #7ab9741c;
`;

const nameCardContainerStyle = css`
  margin-top: 30px;
  display: flex;
  align-self: start;
  padding: 0 1rem;
  justify-content: center;
`;

interface LinkItem {
  key: string;
  href?: string;
  title: string;
  icon: React.ReactNode;
  children?: LinkItem[];
}

interface NavLinksProps {
  linkItems: LinkItem[];
  customLinkStyle?: React.CSSProperties;
}

const NavLinks = ({ linkItems, customLinkStyle }: NavLinksProps) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    const newOpenMenus = { ...openMenus };
    linkItems.forEach((item) => {
      if (item.children?.some((child) => child.href === location.pathname)) {
        newOpenMenus[item.key] = true;
      } else if (item.key === '3') {
        newOpenMenus[item.key] = false;
      }
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname, linkItems]);

  return (
    <nav css={navStyle}>
      {linkItems.map((item) => {
        const isActive =
          location.pathname === item.href ||
          (item.children && item.children.some((child) => location.pathname === child.href));
        const isOpen = openMenus[item.key] || isActive;

        return (
          <div key={item.key}>
            <Link
              to={item.href}
              onClick={() => {
                if (item.key === '3') toggleMenu(item.key);
              }}
              css={[linkStyle, customLinkStyle, isActive && activeLinkStyle]}
            >
              {item.icon}
              {item.title}
              {item.key === '3' &&
                (isOpen ? (
                  <ChevronUp style={{ marginLeft: 'auto', marginRight: '10px', opacity: 0.5 }} />
                ) : (
                  <ChevronDown style={{ marginLeft: 'auto', marginRight: '10px', opacity: 0.5 }} />
                ))}
            </Link>

            {item.key === '3' && (
              <div css={subLinkStyle} className={isOpen ? 'open' : ''}>
                {item.children?.map((child) => {
                  const isChildActive = location.pathname === child.href;

                  return (
                    <Link
                      to={child.href}
                      key={child.key}
                      css={[linkStyle, customLinkStyle, location.pathname === child.href && activeLinkStyle]}
                    >
                      <span style={{ color: isChildActive ? '#2e7d32' : '#525252' }}>{child.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

const linkItems: LinkItem[] = [
  { key: '1', href: '/', title: '메인', icon: <Home /> },
  { key: '2', href: '/feed', title: '피드', icon: <Radio /> },
  {
    key: '3',
    title: '내 기록',
    icon: <FileText />,
    children: [
      {
        key: '3-1',
        href: '/savedContents/bookmark',
        title: '북마크',
        icon: <Check style={{ width: '0.9rem', height: '0.9rem' }} />,
      },
      {
        key: '3-2',
        href: '/savedContents/calls',
        title: '음성기록',
        icon: <Check style={{ width: '0.9rem', height: '0.9rem' }} />,
      },
      {
        key: '3-3',
        href: '/savedContents/feed',
        title: '내 피드',
        icon: <Check style={{ width: '0.9rem', height: '0.9rem' }} />,
      },
    ],
  },
  { key: '4', href: '/profile', title: '프로필', icon: <User /> },
];

const BottomLinkItems: LinkItem[] = [{ key: '1', href: '/guide', title: '서비스 가이드', icon: <Settings /> }];

export const NavBarContainer = () => {
  const auth = useRecoilState(authState);
  const isLoggedIn = JSON.parse(sessionStorage.getItem('isLoggedIn') || 'false');
  const user = JSON.parse(sessionStorage.getItem('user') || 'false');
  // console.log('login: ', auth);
  const { data: userInfo, isLoading } = useUserQuery();
  console.log(user);

  return (
    <div css={sidebarStyle}>
      <div css={topSectionStyle}>
        <Link to="/">
          <Logo />
        </Link>

        {isLoggedIn && user ? (
          <div css={nameCardContainerStyle}>
            <NameCard
              userNickname={user.nickname}
              userImage={user.profileImageUrl || ''}
              userCountry={user.nationality || ''}
              userNativeLanguage={user.nativeLanguageId}
            />
          </div>
        ) : (
          <div
            css={nameCardContainerStyle}
            style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '2.2rem', marginBottom: '1rem' }}
          >
            <Link to="oauth2/code">
              <button
                style={{
                  backgroundColor: '#ffffff',
                  color: '#202022',
                  width: '80px',
                  height: '35px',
                  border: '1px solid #a0a0a0',
                  borderRadius: '6px',
                }}
              >
                SignUp
              </button>
            </Link>
            <Link to="oauth2/code">
              <button
                style={{
                  backgroundColor: '#202022',
                  color: '#ffffff',
                  width: '80px',
                  height: '35px',
                  border: '1px solid #a0a0a0',
                  borderRadius: '6px',
                }}
              >
                Login
              </button>
            </Link>
          </div>
        )}
      </div>

      <div css={middleSectionStyle}>
        <NavLinks linkItems={linkItems} />
      </div>
      <div css={middleSectionStyle2}>
        <NavLinks linkItems={BottomLinkItems} customLinkStyle={bottomLinkStyle} />
      </div>

      <div css={bottomSectionStyle}>
        {isLoggedIn && user ? <GoogleLogout /> : null}
      </div>
    </div>
  );
};