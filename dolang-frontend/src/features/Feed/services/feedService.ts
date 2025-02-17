import axios from 'axios';
import { FeedParticipantsRequest, FeedParticipantsResponse, FeedSentenceRequest, FeedSentenceResponse } from '../types';
import Cookies from 'js-cookie';
import { FeedVoiceUploadRequest } from '../types/FeedVoiceUploadRequest.type';

const base = import.meta.env.VITE_API_BASE_URL;
const token = Cookies.get('access_token');
const instance = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
  },
});

const multipartInstance = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  },
});


// 오늘의 피드 요청
export const getFeed = async (params: FeedSentenceRequest): Promise<FeedSentenceResponse> => {
  try {
    const response = await instance.get('api/feed/today', { params });
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
    return response.data.result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 피드 참여 요청
export const postFeedVoiceUpload = async (params: FeedVoiceUploadRequest) => {
  try {
    const formData = new FormData();
    formData.append('file', params.file); 

    const response = await multipartInstance.post(`/api/post/${params.feedId}/upload`, formData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
