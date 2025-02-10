export interface FeedParticipationResponse {
  isSuccess: boolean;
  message: '성공' | '실패';
  code: number;
  result: FeedParticipation[];
  meta: FeedParticipationMeta;
}

export interface FeedParticipationMeta {
  sort: 'likes' | 'bookmark';
  limit: number;
  nextCursor: string;
  hasNext: boolean;
}

export interface FeedParticipation {
  postId: number;
  profileImageUrl: string;
  country: string;
  nativeLanguage: string;
  voiceUrl: string;
  heartCount?: number;
  bookmarkCount?: number;
  voiceCreatedAt: string;
}