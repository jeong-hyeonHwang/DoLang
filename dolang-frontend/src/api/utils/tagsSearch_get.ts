import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router';
// import { debounce } from 'lodash';

interface ImportMetaEnv {
  readonly VITE_USER_SERVER_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
const accessToken = Cookies.get('access_token');

export const tagsSearchGet = async (nativeLanguageId: string, query: string, access_token?: string) => {
  const token = access_token || accessToken;
  const name = query.replace(/^#/, '');
  try {
    const response = await fetch(`${SERVER_URL}/api/tag/search?nativeLanguageId=${nativeLanguageId}&name=${name}`, {
      method: 'GET',
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('tagrrr', response);
    if (response.ok) {
      const data = await response.json();
      const tags =
        data.result?.map((tag: { tagId: number; name: string }) => ({ tagId: tag.tagId, name: tag.name })) || [];
      // const tagNames = data.result?.map((tag: { name: string }) => tag.name) || [];
      console.log('tname: ', tags);
      if (tags.length >= 1) {
        return tags;
      } else {
        return [];
      }
    }
  } catch (error) {
    console.log('Error fetching tags: ', error);
  }
  return [];
};
