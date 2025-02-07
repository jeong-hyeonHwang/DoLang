// 유저가 로그인된 상태가 선행되어야 함
// 매칭 시작

import axios from 'axios';
import { MatchRequest, MatchResponse } from '../types';

// 매칭 큐에 자기 자신의 정보를 등록 요청 (res, err)
export const matchRequest = async (request: MatchRequest): Promise<MatchResponse> => {
  try {
    const res = await axios.post('/api/match-request', {
      user: request.user,
      interests: request.interests,
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 매칭 결과 조회
export const getMatchResult = async (matchId: number): Promise<MatchResponse> => {
  try {
    const res = await axios.get('/api/match-result?matchId=' + matchId);
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 매칭 취소
// 매칭 큐에서 자기 자신의 정보를 삭제 요청
export const handleMatchCancel = async (matchId: number): Promise<MatchResponse> => {
  try {
    const res = await axios.delete('/api/match-cancel', { params: { matchId: matchId } });
    if (res.data.status === 'match_canceled') {
      console.log('매칭 취소 성공');
    }
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
