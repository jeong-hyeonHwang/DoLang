import styled from '@emotion/styled';
import { useState } from 'react';

interface UserProfileImageProps {
  src: string;
  alt: string;
  size?: number;
}

const ImageContainer = styled.div<{ size?: number }>`
  width: ${(props) => props.size || 32}px;
  height: ${(props) => props.size || 32}px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LoadingPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export default function UserProfileImage({ src, alt, size }: UserProfileImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <ImageContainer size={size}>
      {isLoading && <LoadingPlaceholder />}
      <Image
        src={hasError ? 'https://v0.dev/placeholder.svg' : src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </ImageContainer>
  );
}
