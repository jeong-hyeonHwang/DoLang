import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;

import { Outlet } from 'react-router-dom';
import { NavBarContainer } from './components/navBar/NavBarContainer.tsx';

const contentStyle: React.CSSProperties = {
  // Content 레이아웃 관리 style
  // marginLeft: '15rem',
  minHeight: '100vh',
  padding: '24px 16px 24px',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexGrow: 1,
  width: '100%',
  flexDirection: 'column',
  overflow: 'auto',
};
const LayoutDesign: React.FC = () => {
  return (
    <Layout>
      <NavBarContainer />

      <Layout style={{ marginLeft: '15rem' }}>
        <Header style={{ height: '40px', padding: 0, background: '#f5f5f5' }} />
        <Content style={contentStyle}>
          <div
            // Content 내부, div 내용물에 대한 style
            style={{
              padding: 10,
              textAlign: 'center',
              border: '2px solid #f5f5f5', // 내부 content test용
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
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: '100%',
                  height: '100%',
                  overflow: 'auto',
                }}
              >
                <Outlet />
              </div>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>DoLang ©{new Date().getFullYear()} Created by DoLang</Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutDesign;
