import React from 'react';
import styled from '@emotion/styled';
import { Bookmark, Play, Pause } from 'lucide-react';
import { theme } from './MainTheme';
import { motion } from 'framer-motion';

const FeedContainer = styled(motion.div)`
  background: ${theme.colors.white};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FeedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: ${theme.fontSizes.xlarge};
  font-weight: bold;
  color: ${theme.colors.primary};
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${theme.fontSizes.small};
  color: ${theme.colors.lightText};
`;

const AudioList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AudioItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${theme.colors.background};
  border-radius: 8px;
  transition: background 0.3s ease;

  &:hover {
    background: ${theme.colors.secondary}20;
  }
`;

const ProfileImage = styled.div`
  position: relative;
  width: 3rem;
  height: 3rem;
`;

const Avatar = styled.div<{ bgColor: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor};
`;

const SmallFlag = styled.img`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 1rem;
  height: 0.75rem;
`;

const AudioControls = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AudioWave = styled.div`
  flex: 1;
  height: 2rem;
  background: linear-gradient(90deg, ${theme.colors.secondary} 1px, transparent 1px) repeat-x;
  background-size: 8px 100%;
  margin: 0 1rem;
  opacity: 0.5;
`;

const BookmarkCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${theme.colors.lightText};
  font-size: ${theme.fontSizes.small};
`;

const PlayButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.primary};
`;

export default function FeedSection() {
  const [playing, setPlaying] = React.useState<number | null>(null);

  return (
    <FeedContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <FeedHeader>
        <Title>오늘의 피드</Title>
        <LanguageSelector>
          <img src="https://flagcdn.com/w20/us.png" alt="US Flag" width="16" height="12" />
          English
        </LanguageSelector>
      </FeedHeader>

      <AudioList>
        {[
          { color: '#1a237e', count: 34 },
          { color: '#aed581', count: 12 },
          { color: '#ffb4b4', count: 8 },
        ].map((item, index) => (
          <AudioItem key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <ProfileImage>
              <Avatar bgColor={item.color} />
              <SmallFlag src="https://flagcdn.com/w20/us.png" alt="US Flag" />
            </ProfileImage>

            <AudioControls>
              <PlayButton
                onClick={() => setPlaying(playing === index ? null : index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {playing === index ? <Pause size={24} /> : <Play size={24} />}
              </PlayButton>
              <AudioWave />
              <BookmarkCount>
                <Bookmark size={16} />
                {item.count}
              </BookmarkCount>
            </AudioControls>
          </AudioItem>
        ))}
      </AudioList>
    </FeedContainer>
  );
}
