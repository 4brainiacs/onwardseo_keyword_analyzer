/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SCRAPINGBEE_API_KEY: string;
  readonly MODE: 'development' | 'production';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly TEST: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}