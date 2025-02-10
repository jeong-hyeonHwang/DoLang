import { beforeAll, afterEach, afterAll, describe, test, expect } from '@jest/globals';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { endpoints } from '../services/api';
import { getNativeFeedSentence, getLearningLanguageFeedSentence } from '../services/feedService';
import { nativeFeedSentenceTestData, learningLanguageFeedSentenceTestData } from './feedTestData';

const server = setupServer(
  // 모국어 피드 문장 페칭
  http.get(endpoints.NATIVE_SENTENCE, () => {
    return HttpResponse.json(nativeFeedSentenceTestData);
  }),

  // 학습 언어 피드 문장 페칭
  http.get(endpoints.LEARNING_LANGUAGE_SENTENCE, () => {
    return HttpResponse.json(learningLanguageFeedSentenceTestData);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Feed', () => {
  test('모국어 피드 문장 페칭', async () => {
    const data = await getNativeFeedSentence({
      lang: 'en',
    });
    expect(data).toEqual(nativeFeedSentenceTestData);
  });

  test('학습 언어 피드 문장 페칭', async () => {
    const data = await getLearningLanguageFeedSentence({
      lang: 'en',
    });
    expect(data).toEqual(learningLanguageFeedSentenceTestData);
  });
});