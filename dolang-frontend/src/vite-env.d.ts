/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_REDIRECT_URI: string;
  readonly VITE_GOOGLE_AUTH_SERVER_URL: string;
  readonly VITE_GOOGLE_AUTHORIZATION: string;
  readonly VITE_USER_SERVER_URL: string;

  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_FEED_URL: string;
  readonly VITE_MATCHING_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
