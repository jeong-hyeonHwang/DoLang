import { FeedParticipantsResponse } from './FeedParticipantsResponse.type.ts';
export interface FeedSentenceResponse {
  date: string;
  feedId: number;
  lang: string;
  isNativeFeed: boolean;
  sentenceInfo: SentenceInfo;
  userParticipation: Partial<FeedParticipantsResponse>;
}

export interface SentenceInfo {
  sentenceId: number;
  sentence: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}
