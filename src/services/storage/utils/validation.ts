import { STORAGE_DEFAULTS, STORAGE_ERRORS } from '../constants';

export function validateKey(key: string): { isValid: boolean; error?: string } {
  if (!key || typeof key !== 'string') {
    return { isValid: false, error: STORAGE_ERRORS.INVALID_KEY };
  }

  if (key.length > STORAGE_DEFAULTS.MAX_KEY_LENGTH) {
    return { isValid: false, error: STORAGE_ERRORS.KEY_TOO_LONG };
  }

  return { isValid: true };
}

export function validateValue(value: unknown): { isValid: boolean; error?: string } {
  try {
    const serialized = JSON.stringify(value);
    if (serialized.length > STORAGE_DEFAULTS.MAX_VALUE_SIZE) {
      return { isValid: false, error: STORAGE_ERRORS.VALUE_TOO_LARGE };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: STORAGE_ERRORS.SERIALIZATION_FAILED };
  }
}