interface ImportMetaEnv {
  readonly VITE_API_TITLE: string;
  readonly VITE_API_BASE_URL: string;            
  readonly VITE_API_FEED_URL: string;
  readonly VITE_API_MATCHING_URL: string;
  readonly VITE_API_AUTH_URL: string;       
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}   