import axios from 'axios';
import { FeedParticipantsRequest, FeedParticipantsResponse, FeedSentenceRequest, FeedSentenceResponse } from '../types';
const base = import.meta.env.VITE_API_BASE_URL;
const instance = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

// 오늘의 피드 요청
export const getFeed = async (params: FeedSentenceRequest): Promise<FeedSentenceResponse> => {
  try {
    const response = await instance.get('api/feed/today', { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 피드 참여 데이터 요청
export const getFeedParticipation = async (params: FeedParticipantsRequest): Promise<FeedParticipantsResponse> => {
  try {
    const response = await instance.get('api/feed/today/participants', { params });
    console.log(response.data);
    return response.data.result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


// 피드 참여 요청
// export const postFeedParticipation = async (params: FeedParticipantsRequest) => {
//   const response = await instance.post('/today/participants', { params });
//   return response.data;
// };
