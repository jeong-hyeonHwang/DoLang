/* 
테스트를 위해 native, learningLanguage 요청과 엔드포인트가 분리되었습니다.
진행 상황에 맞춰, 또는 프로덕션 환경에서는 하나의 요청으로 통합될 예정입니다.
*/

export const base = import.meta.env.VITE_API_FEED_URL;
export const endpoints = {
  NATIVE_SENTENCE: `${base}/today`,
  LEARNING_LANGUAGE_SENTENCE: `${base}/today`,
  NATIVE_PARTICIPATION: `${base}/today/participants`,
  LEARNING_LANGUAGE_PARTICIPATION: `${base}/today/participants`,
};