import { FeedParticipation } from './feedParticipation.type';
export interface FeedSentenceResponse {
  isSuccess: boolean;
  message: '성공' | '실패';
  code: number;
  result: FeedSentence;
}

export interface FeedSentence {
  date: string;
  feedId: number;
  lang: string;
  isNativeFeed: boolean;
  sentenceInfo: SentenceInfo;
  userParticipation: Partial<FeedParticipation>;
}

export interface SentenceInfo {
  sentenceId: number;
  sentence: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}