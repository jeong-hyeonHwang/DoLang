import { apiInstance } from '@/api/utils/instance';
import { MyFeedRequest, MyFeedResponse } from '../types';

// 내 피드 요청
// http://localhost:8100/api/myfeed?page=0&lang=en
export const getMyFeed = async (params: Partial<MyFeedRequest>): Promise<MyFeedResponse> => {
  try {
    const response = await apiInstance.get('api/myfeed', { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



// 내가 반응을 남긴(북마크, 좋아요) 피드 요청
// http://localhost:8100/api/myfeed/liked?lang=en
export const getFeedWithMyReaction = async (params: Partial<MyFeedRequest>): Promise<MyFeedResponse> => {
  try {
    const response = await apiInstance.get(`api/myfeed/liked?lang=${params?.lang}`, { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 내가 반응을 남긴(북마크, 좋아요) 단일 피드 요청
// http://localhost:8100/api/myfeed/liked/{feedId}
export const getFeedWithMyReactionByFeedId = async (params: Partial<MyFeedRequest>): Promise<MyFeedResponse> => {
  try {
    const response = await apiInstance.get(`api/myfeed/liked/${params?.feedId}`, { params });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};