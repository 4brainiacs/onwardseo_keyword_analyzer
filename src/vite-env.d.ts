/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SCRAPINGBEE_API_KEY: string
  readonly MODE: 'development' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}