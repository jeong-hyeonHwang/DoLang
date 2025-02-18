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
