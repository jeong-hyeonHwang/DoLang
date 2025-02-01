import { css } from '@emotion/react';
import { Outlet } from 'react-router';
import { NavBarContainer } from './components/navBar/NavBarContainer';

const layoutStyle = css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const mainStyle = css`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
  width: calc(100vw - 220px);
`;

export default function Layout() {
  return (
    <div css={layoutStyle}>
      <NavBarContainer />
      <main css={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
}