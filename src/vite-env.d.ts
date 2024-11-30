/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

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