/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest/globals" />
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@testing-library/jest-dom';
declare module 'vitest/globals';
declare module 'http-status-codes';
declare module 'react' {
  interface JSX {
    IntrinsicElements: {
      [elemName: string]: any;
    };
  }
}