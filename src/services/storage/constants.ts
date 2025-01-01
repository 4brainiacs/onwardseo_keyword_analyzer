export const STORAGE_DEFAULTS = {
  PREFIX: 'seo_analyzer_',
  TTL: 24 * 60 * 60 * 1000, // 24 hours
  MAX_KEY_LENGTH: 100,
  MAX_VALUE_SIZE: 5 * 1024 * 1024 // 5MB
} as const;

export const STORAGE_ERRORS = {
  KEY_TOO_LONG: 'Storage key exceeds maximum length',
  VALUE_TOO_LARGE: 'Storage value exceeds maximum size',
  INVALID_KEY: 'Invalid storage key',
  SERIALIZATION_FAILED: 'Failed to serialize value',
  PARSE_FAILED: 'Failed to parse stored value'
} as const;