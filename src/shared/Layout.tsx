// import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import { NavBarContainer } from './components/navBar/NavBarContainer';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 100vh;
`;

const MainContent = styled.main`
  display: flex;
  position: relative;
  flex-grow: 1;
  overflow-y: auto;
  padding: 2rem;
  justify-content: center;
  width: calc(100vw - 220px);
  margin-left: 14rem;
`;

export default function Layout() {
  return (
    <LayoutWrapper>
      <NavBarContainer />

      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutWrapper>
  );
}
