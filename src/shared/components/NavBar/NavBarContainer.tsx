import { useNavigate } from 'react-router';
import React from 'react';
import { Anchor, Col, Row } from 'antd';

export const NavBarContainer = () => {
  const navigate = useNavigate();

  const handleClick = (
    href: string,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    navigate(href);
  };

  return (
    <>
      <Row>
        <Col span={8}>
          <Anchor
            items={[
              {
                key: 'part-1',
                href: '/',
                title: <a onClick={(e) => handleClick('/', e)}>메인</a>,
              },
              {
                key: 'part-2',
                href: '/feed',
                title: <a onClick={(e) => handleClick('/feed', e)}>피드</a>,
              },
              {
                key: 'part-3',
                href: '/savedContents',
                title: (
                  <a onClick={(e) => handleClick('/savedContents', e)}>
                    내 기록
                  </a>
                ),
              },
              {
                key: 'part-4',
                href: '/profile',
                title: (
                  <a onClick={(e) => handleClick('/profile', e)}>프로필</a>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
};
