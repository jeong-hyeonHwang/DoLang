import React, { useState } from 'react';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;

import { Outlet } from 'react-router-dom';
import Logo from './components/Logo/Logo';

const logoStyle: React.CSSProperties = {};

const contentStyle: React.CSSProperties = {
  minHeight: '100vh',
  padding: '24px 16px 24px',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexGrow: 1,
  width: '100%',
  flexDirection: 'column',
  overflow: 'auto',
};

const scrollStyle = css`
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  ::-webkit-scrollbar-thumb {
    display: none;
  }

  ::-webkit-scrollbar-track {
    display: none;
  }
`;

const LayoutNoNav: React.FC = () => {
  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '75px',
          padding: 0,
          background: '#f5f5f5',
          borderBottom: '1px solid #e8e8e86d',
        }}
      >
        <Link to="/">
          <Logo style={logoStyle} />
        </Link>
      </Header>
      <Content style={contentStyle} css={scrollStyle}>
        <div
          style={{
            padding: '10px',
            textAlign: 'center',
            // border: '2px solid #f5f5f5', // 내부 content test용
            background: '#ffffff',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            flexGrow: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Outlet />
            </div>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>DoLang ©{new Date().getFullYear()} Created by DoLang</Footer>
    </Layout>
  );
};
export default LayoutNoNav;
