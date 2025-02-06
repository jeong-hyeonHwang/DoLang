import { FeedParticipation } from '../types/feedParticipation.type';
import { FeedSentence } from '../types/feedSentence.type';
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

export const nativeFeedSentenceTestData: FeedSentence = {
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
};

export const learningLanguageFeedSentenceTestData: FeedSentence = {
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
};

export const nativeFeedTestData: FeedParticipation[] = [
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
];

export const learningLanguageFeedTestData: FeedParticipation[] = [
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
];
