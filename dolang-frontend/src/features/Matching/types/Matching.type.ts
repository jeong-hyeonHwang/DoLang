export interface MatchRequest {
  user: { id: number; name: string; flag: string; image: string | null };
  interests: string[];
}

export interface MatchResponse {
  matchedUser: MatchedUser;
  status: 'match_started' | 'match_found' | 'match_not_found';
  matchId: number;
}

export interface MatchingResult {
  me: MatchedUser;
  matchedUser: MatchedUser;
  ownerYN: boolean;
}

export interface MatchedUser {
  peerId: string;
  userId: string;
  username: string;
  gender: 'M' | 'F';
  profileImageUrl: string;
  nickname: string;
  countryId: 'en' | 'kr';
  nativeLanguageId: 'en' | 'kr';
  interestLanguageId: 'en' | 'kr';
  userTagList: string[];
}

