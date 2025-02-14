import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import MyAudioPlayer from './MyAudioPlayer';
import MyAudioFeed from './MyAudioFeed';
import { Flex } from 'antd';

const PageContainer = styled.div`
  background-color: #fff;
  min-width: 700px;
  width: 100%;
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

const ContentContainer = styled.div`
  background-color: #dddddd;
  min-height: 800px;
  height: 100vh;
  /* min-width: 500px;
  width: 85%;
  padding: 30px;
  margin: 50px 0; */
  border-radius: 30px;
  overflow-y: scroll;
  overflow-x: auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  /* &::-webkit-scrollbar {
    width:;
  } */
`;

const ContentScroll = styled.div`
  overflow-x: visible;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 32px;
  margin-top: 32px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 38px;
  font-weight: bold;
  color: #212529;
`;

// // 커스텀 스크롤바 스타일링
// export const ScrollContainer = styled.div`
//   /* 가로 스크롤 숨기기 */
//   overflow-x: hidden;

//   /* 세로 스크롤 스타일링 */
//   overflow-y: auto;

//   /* 웹킷 기반 브라우저용 스크롤바 스타일링 */
//   &::-webkit-scrollbar {
//     width: 8px;
//   }

//   &::-webkit-scrollbar-track {
//     background: #f1f1f1;
//     border-radius: 4px;
//   }

//   &::-webkit-scrollbar-thumb {
//     background: #888;
//     border-radius: 4px;

//     &:hover {
//       background: #555;
//     }
//   }
// `;

function MyFeedView() {
  return (
    <>
      <div css={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        <PageContainer>
          <Header>
            <Title>내 피드</Title>
          </Header>

          <ContentContainer>
            <MyAudioFeed />
          </ContentContainer>
        </PageContainer>
      </div>
    </>
  );
}

export default MyFeedView;
