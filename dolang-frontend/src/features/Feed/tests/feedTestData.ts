import { FeedParticipation, FeedParticipationResponse } from '../types/feedParticipation.type';
import { FeedSentenceResponse } from '../types/feedSentence.type';
// 모국어 피드 문장

export const userNativeParticipationTestData: Partial<FeedParticipation> = {
  voiceUrl: '/test.wav',
  bookmarkCount: 30,
  voiceCreatedAt: '2025-01-31T00:00:00Z',
};

export const userLearningLanguageParticipationTestData: Partial<FeedParticipation> = {
  voiceUrl: '/test.wav',
  heartCount: 30,
  voiceCreatedAt: '2025-01-31T00:00:00Z',
};

export const nativeFeedSentenceTestData: FeedSentenceResponse = {
  isSuccess: true,
  message: '성공',
  code: 200,
  result: {
    date: '2025-01-31T00:00:00Z',
    feedId: 1001,
    lang: 'kr',
    isNativeFeed: true,
    sentenceInfo: {
      sentenceId: 2222,
      sentence: '안녕하세요',
      level: 'A2',
    },
    userParticipation: userNativeParticipationTestData,
  },
};

export const learningLanguageFeedSentenceTestData: FeedSentenceResponse = {
  isSuccess: true,
  message: '성공',
  code: 200,
  result: {
    date: '2025-01-31T00:00:00Z',
    feedId: 1001,
    lang: 'en',
    isNativeFeed: false,
    sentenceInfo: {
      sentenceId: 2222,
      sentence: 'Hello everyone',
      level: 'A2',
    },
    userParticipation: userLearningLanguageParticipationTestData,
  },
};

export const nativeFeedTestData: FeedParticipationResponse = {
  isSuccess: true,
  message: '성공',
  code: 200,
  result: [
    {
      profileImage: 'https://example.com/profile/bob.jpg',
      country: 'es',
      countryImageUrl: 'https://example.com/country/korea.jpg',
      voiceUrl: '/test.wav',
      voiceCreatedAt: '2025-01-31T00:00:00Z',
    },
    {
      profileImage: 'https://example.com/profile/alice.jpg',
      country: 'es',
      countryImageUrl: 'https://example.com/country/usa.jpg',
      voiceUrl: '/test.wav',
      voiceCreatedAt: '2025-01-31T00:00:00Z',
    },
    {
      profileImage: 'https://example.com/profile/alice.jpg',
      country: 'es',
      countryImageUrl: 'https://example.com/country/usa.jpg',
      voiceUrl: '/test.wav',
      voiceCreatedAt: '2025-01-31T00:00:00Z',
    },
    {
      profileImage: 'https://example.com/profile/alice.jpg',
      country: 'es',
      countryImageUrl: 'https://example.com/country/usa.jpg',
      voiceUrl: '/test.wav',
      voiceCreatedAt: '2025-01-31T00:00:00Z',
    },
    {
      profileImage: 'https://example.com/profile/alice.jpg',
      country: 'es',
      countryImageUrl: 'https://example.com/country/usa.jpg',
      voiceUrl: '/test.wav',
      voiceCreatedAt: '2025-01-31T00:00:00Z',
    },
  ],
  meta: {
    sort: 'likes',
    limit: 5,
    nextCursor: '1735603200',
    hasNext: true,
  },
};

export const learningLanguageFeedTestData: FeedParticipationResponse = {
  isSuccess: true,
  message: '성공',
  code: 200,
  result: [
    {
      profileImage: 'https://example.com/profile/bob.jpg',
      country: 'en',
      countryImageUrl: 'https://example.com/country/korea.jpg',
      voiceUrl: 'test.wav',
      voiceCreatedAt: '2025-01-31T00:00:00Z',
    },
    {
      profileImage: 'https://example.com/profile/alice.jpg',
      country: 'us',
      countryImageUrl: 'https://example.com/country/usa.jpg',
      voiceUrl: 'test.wav',
      voiceCreatedAt: '2025-01-31T00:00:00Z',
    },
    {
      profileImage: 'https://example.com/profile/alice.jpg',
      country: 'us',
      countryImageUrl: 'https://example.com/country/usa.jpg',
      voiceUrl: 'test.wav',
      voiceCreatedAt: '2025-01-31T00:00:00Z',
    },
    {
      profileImage: 'https://example.com/profile/alice.jpg',
      country: 'us',
      countryImageUrl: 'https://example.com/country/usa.jpg',
      voiceUrl: 'test.wav',
      voiceCreatedAt: '2025-01-31T00:00:00Z',
    },
    {
      profileImage: 'https://example.com/profile/alice.jpg',
      country: 'us',
      countryImageUrl: 'https://example.com/country/usa.jpg',
      voiceUrl: 'test.wav',
      voiceCreatedAt: '2025-01-31T00:00:00Z',
    },
  ],
  meta: {
    sort: 'likes',
    limit: 5,
    nextCursor: '1735603200',
    hasNext: true,
  },
};