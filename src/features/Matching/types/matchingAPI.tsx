export type MatchRequest = {
  user: { id: number; name: string; flag: string; image: string | null };
  interests: string[];
};

export type MatchResponse = {
  matchedUser: { id: number };
  status: 'match_started' | 'match_found' | 'match_not_found';
  matchId: number;
};
