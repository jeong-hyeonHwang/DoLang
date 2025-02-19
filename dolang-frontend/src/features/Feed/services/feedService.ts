import { FeedParticipantsRequest, FeedParticipantsResponse, FeedSentenceRequest, FeedSentenceResponse } from '../types';
import { apiInstance } from '@/api/utils/instance';
import { FeedVoiceUploadRequest } from '../types/FeedVoiceUploadRequest.type';
// 오늘의 피드 요청
export const getFeed = async (params: FeedSentenceRequest): Promise<FeedSentenceResponse> => {
  try {
    const response = await apiInstance.get('api/feed/today', { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 피드 참여 데이터 요청
export const getFeedParticipants = async (params: FeedParticipantsRequest): Promise<FeedParticipantsResponse> => {
  try {
    const response = await apiInstance.get('api/feed/today/participants', { params });
    console.log(response.data);
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

    const response = await apiInstance.post(`/api/post/${params.feedId}/upload`, formData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
