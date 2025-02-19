import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import MyAudioPlayer from './MyAudioPlayer';
import MyBookmark from './MyBookmark';
import { Flex } from 'antd';

const PageContainer = styled.div`
  background-color: #fff;
  max-width: 1000px;
  min-width: 700px;
  margin: 0 auto;
  padding: 0 4rem;
  min-height: 1000px;
  height: 100vh;
  display: flex;

  flex-direction: column;
  overflow: scroll;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const ContentOutline = styled.div`
  background-color: #dddddd;
  padding: 20px;
  height: 100vh;
  min-height: 800px;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ContentContainer = styled.div`
  /* background-color: #dddddd; */
  min-height: 600px;
  height: 100%;
  border-radius: 30px;
  overflow-y: auto;
  overflow-x: auto;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); */

  &::-webkit-scrollbar {
    width: 16px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb {
    background: #8888889b;
    border-radius: 50px;

    &:hover {
      background: #888;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 32px;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: bold;
  color: #212529;
`;

function BookMarkView() {
  return (
    <>
      <div css={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        <PageContainer>
          <Header>
            <Title>북마크</Title>
          </Header>

          <ContentOutline>
            <ContentContainer>
              <MyBookmark />
            </ContentContainer>
          </ContentOutline>
        </PageContainer>
      </div>
    </>
  );
}

export default BookMarkView;
