/// <reference types="vite/client" />

interface Window {
  __RUNTIME_CONFIG__?: {
    VITE_API_URL: string;
    NODE_ENV: string;
    VITE_SCRAPINGBEE_API_KEY?: string;
  };
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SCRAPINGBEE_API_KEY?: string;
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly TEST: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'jsdom';
declare module 'dompurify';