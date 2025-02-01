import { Link } from 'react-router-dom';
import {
  Home,
  Radio,
  FileText,
  User,
  Settings,
  Search,
  LogOut,
} from 'lucide-react';
import styled from '@emotion/styled';

import MiniProfile from './MiniProfile_login';
import LogoImage from '../Logo/Logo';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 16rem;
  height: 100%;
  background-color: white;
  border-right: 1px solid #e5e7eb;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  /* border-bottom: 1px solid #e5e7eb; */
`;

const Nav = styled.nav`
  flex-grow: 1;
`;

const NavList = styled.ul`
  padding: 1rem 0;
  space-between: 0.5rem;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: #374151;
  text-decoration: none;

  &:hover {
    background-color: #f3f4f6;
    font-weight: bold;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
  }
`;

const LogoutButton = styled.button`
  border: none;
  background-color: white;
  box-sizing: content-box;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  padding-left: 75px;
  color: #374151;
  border-top: 1px solid #e5e7eb;

  &:hover {
    color: #13112d;
    font-weight: bold;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
  }
`;

const GuideLink = styled(Link)`
  position: relative;
  bottom: -80px;
  left: 5px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #787879;
  text-decoration: none;
  font-size: 0.8rem;

  align-items: center;
  padding: 0.3rem 1.5rem;
  text-decoration: none;

  &:hover {
    /* background-color: #f3f4f6; */
    color: #374151;
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: 0.25rem;
  }
`;

export default function Sidebar() {
  return (
    <>
      <Logo />
      <SidebarContainer>
        <Logo>
          <LogoImage></LogoImage>
        </Logo>
        <Nav>
          <NavList>
            <li>
              <MiniProfile />
            </li>
            <li>
              <NavItem to="/">
                <Home />
                Main
              </NavItem>
            </li>
            <li>
              <NavItem to="/feed">
                <Radio />
                Feed
              </NavItem>
            </li>
            <li>
              <NavItem to="/my-record">
                <FileText />
                My Record
              </NavItem>
            </li>
            <li>
              <NavItem to="/profile">
                <User />
                Profile
              </NavItem>
            </li>
          </NavList>

          <NavList>
            <GuideLink to="/AboutDoLang">
              <Search size={20} />
              서비스 가이드
            </GuideLink>
            <GuideLink to="/settings">
              <Settings />
              설정
            </GuideLink>
          </NavList>
        </Nav>

        <LogoutButton>
          <LogOut />
          로그아웃
        </LogoutButton>
      </SidebarContainer>
    </>
  );
}
