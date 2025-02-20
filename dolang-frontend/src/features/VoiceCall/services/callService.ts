import { apiInstance } from '@/api/utils/instance';

export const postStartCall = async (matchedUserId: string) => {
  try {
    const response = await apiInstance.post(`/api/call/start`, { matchedUserId });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const postEndCall = async (callId: number) => {
  try {
    const response = await apiInstance.post(`/api/call/end`, { callId });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
