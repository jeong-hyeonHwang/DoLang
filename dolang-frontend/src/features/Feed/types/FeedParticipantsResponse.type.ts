export interface FeedParticipantsResponse {
  meta: FeedParticipationMeta;
  participants: FeedParticipant[];
}

export interface FeedParticipationMeta {
  hasNext: boolean;
  limit: number;
  nextCursor: string;
  sort: string;
  participants: FeedParticipantsResponse[];
}

export interface FeedParticipant {
  postId: number;
  profileImageUrl: string;
  country: string;
  voiceUrl: string;
  voiceCreatedAt: string;
  bookmarkCount?: number;
  heartCount?: number;
}