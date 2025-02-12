import { beforeAll, afterEach, afterAll, describe, test, expect } from '@jest/globals';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { endpoints } from '../services/api';
import {
  getNativeFeedParticipation,
  getLearningLanguageFeedParticipation,
  postLearningLanguageFeedParticipation,
  postNativeFeedParticipation,
} from '../services/feedService';
import { nativeFeedTestData, learningLanguageFeedTestData } from './feedTestData';

const server = setupServer(
  // 모국어 피드 참여 데이터 페칭
  http.get(endpoints.NATIVE_PARTICIPATION, () => {
    return HttpResponse.json(nativeFeedTestData);
  }),

  // 학습 언어 피드 참여 데이터 페칭
  http.get(endpoints.LEARNING_LANGUAGE_PARTICIPATION, () => {
    return HttpResponse.json(learningLanguageFeedTestData);
  }),

  // 모국어 피드 참여 요청
  http.post(endpoints.NATIVE_PARTICIPATION, () => {
    return HttpResponse.json(200);
  }),
  // 학습 언어 피드 참여 요청
  http.post(endpoints.LEARNING_LANGUAGE_PARTICIPATION, () => {
    return HttpResponse.json(200);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Feed', () => {
  test('모국어 피드 참여 데이터 페칭', async () => {
    const data = await getNativeFeedParticipation({
      feedId: '1',
      sort: 'likes',
      length: 5,
      nextCursor: '1',
    });
    expect(data).toEqual(nativeFeedTestData);
  });

  test('학습 언어 피드 참여 데이터 페칭', async () => {
    const data = await getLearningLanguageFeedParticipation({
      feedId: '1',
      sort: 'likes',
      length: 5,
      nextCursor: '1',
    });
    expect(data).toEqual(learningLanguageFeedTestData);
  });

  test('모국어 피드 참여 요청', async () => {
    const data = await postNativeFeedParticipation({
      feedId: '1',
      sort: 'likes',
      length: 5,
      nextCursor: '1',
    });
    expect(data).toEqual(200);
  });

  test('학습 언어 피드 참여 요청', async () => {
    const data = await postLearningLanguageFeedParticipation({
      feedId: '1',
      sort: 'likes',
      length: 5,
      nextCursor: '1',
    });
    expect(data).toEqual(200);
  });
});