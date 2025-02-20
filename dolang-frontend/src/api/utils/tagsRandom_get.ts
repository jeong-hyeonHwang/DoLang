import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface ImportMetaEnv {
  readonly VITE_USER_SERVER_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const SERVER_URL = import.meta.env.VITE_USER_SERVER_URL;
const fetchRandomTags = async () => {
  try {
    // const response = await fetch(`${SERVER_URL}/api/tag/all`);
    const response = await fetch(`${SERVER_URL}/api/tag/all?nativeLanguageId=kr`);
    if (response.ok) {
      const data = await response.json();
      setSuggestions(data.slice(0, 10));
    }
  } catch (error) {
    console.error('Error: ', error);
  }
};

useEffect(() => {
  if ((inputRef, current)) {
    fetchRandomTags();
  }
}, []);
