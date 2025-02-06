import React from 'react';
import { css } from '@emotion/react';
import { Link, useLocation } from 'react-router';
import NameCard from '../nameCard/NameCard';
import { useUserQuery } from '../../hooks/useUserQuery';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import Logo from '../Logo/Logo';
import { Home, Radio, FileText, User, Settings, Dot, Check } from 'lucide-react';
import GoogleLogout from '@/features/Auth/GoogleLogout';

const sidebarStyle = css`
  padding: 1rem;
  display: flex;
  position: fixed;
  flex-direction: column;
  left: 0;
  top: 0;
  height: 100%;
  width: 14.5rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const navStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  /* padding: 30px 20px; */
  /* margin-top: 20px; */
  /* text-align: start; */
`;

const topSectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* padding: 15px 0; */
`;

const middleSectionStyle = css`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  /* position: absolute; */
  /* padding: 20px 0; */
`;

const middleSectionStyle2 = css`
  position: absolute;
  bottom: 50px;
  display: flex;
  flex-direction: column;
  /* position: absolute; */
`;

const bottomSectionStyle = css`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  /* padding: 20px 0; */
`;

const linkStyle = css`
  font-size: 17px;
  padding: 12px;
  text-decoration: none;
  display: flex;
  align-items: center;
  /* flex-grow: 1; */
  border-radius: 10px;
  color: #333;
  transition: 0.3s ease;

  &:hover {
    /* color: #007bff; */
    /* color: #4caf50; */
    /* background: rgba(122, 185, 116, 0.12); */
    background: rgba(198, 210, 132, 0.12);
    /* color: #7ab974; */
    color: #4caf50;
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
    /* color: #333; */
    color: #525252;
    /* border-radius: 5px; */
    &:hover {
      color: #7ab974;
    }
  }
`;

const bottomLinkStyle = css`
  font-size: 15px;
  margin-top: 40px;
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
`;

const extraButtonsContainerStyle = css`
  margin-top: 20px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
`;

const nameCardContainerStyle = css`
  margin-top: 30px;
  /* margin-bottom: -20px; */
  display: flex;
  justify-content: center;
`;

interface LinkItem {
  key: string;
  href: string;
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

                      {isChildActive && child.icon && (
                        <span style={{ marginLeft: '0.5rem', display: 'inline-flex', color: '#2e7d32' }}>
                          {child.icon}
                        </span>
                      )}
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
    href: '/savedContents',
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
  const { logoutMutation } = useAuth();
  const { data: userInfo, isLoading } = useUserQuery();

  return (
    <div css={sidebarStyle}>
      <div css={topSectionStyle}>
        <Link to="/">
          <Logo />
        </Link>

        <div css={nameCardContainerStyle}>
          <NameCard style={{ border: 'none', backgroundColor: 'transparent' }} />
        </div>
      </div>

      <div css={middleSectionStyle}>
        <NavLinks linkItems={linkItems} />
      </div>
      <div css={middleSectionStyle2}>
        <NavLinks linkItems={BottomLinkItems} customLinkStyle={bottomLinkStyle} />
      </div>

      <div css={bottomSectionStyle}>
        <div css={extraButtonsContainerStyle}>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>{userInfo?.userName && <div onClick={() => logoutMutation.mutate()}>로그아웃</div>}</div>
          )}
        </div>
      </div>
      <GoogleLogout />
    </div>
  );
};
