/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

interface Window {
  __RUNTIME_CONFIG__?: {
    VITE_API_URL: string;
    NODE_ENV: string;
  };
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly TEST: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'jsdom' {
  export class JSDOM {
    constructor(html: string);
    window: Window;
  }
}

declare module 'dompurify' {
  interface DOMPurifyConfig {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    RETURN_DOM?: boolean;
  }

  interface DOMPurify {
    sanitize(html: string | Node, config?: DOMPurifyConfig): string | Document;
    setConfig(config: DOMPurifyConfig): DOMPurify;
    clearConfig(): void;
    isValidAttribute(tag: string, attr: string, value: string): boolean;
  }

  function DOMPurify(window: Window): DOMPurify;
  export default DOMPurify;
}