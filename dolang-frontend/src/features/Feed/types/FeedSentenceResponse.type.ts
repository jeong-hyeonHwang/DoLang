import { FeedParticipant, FeedParticipantsResponse } from './FeedParticipantsResponse.type.ts';
import { MyFeed } from './MyFeedResponse.type.ts';
export interface FeedSentenceResponse {
  isSuccess: boolean;
  code: number;
  message: string;
  result: {
    feed: Feed;
  };
}

export interface SentenceInfo {
  sentence: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface Feed {
  date: string;
  feedId: number;
  lang: string;
  isNativeFeed: boolean;
  sentenceInfo: SentenceInfo;
  userParticipation: Partial<MyFeed>;
}
