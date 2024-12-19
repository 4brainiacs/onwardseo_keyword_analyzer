import type { ValidationRule } from '../types';

export const urlRules: ValidationRule<string>[] = [
  {
    validate: (url) => ({
      isValid: Boolean(url?.trim()),
      error: 'URL is required'
    }),
    message: 'URL is required'
  },
  {
    validate: (url) => {
      try {
        new URL(url);
        return { isValid: true };
      } catch {
        return { 
          isValid: false,
          error: 'Invalid URL format'
        };
      }
    },
    message: 'Invalid URL format'
  },
  {
    validate: (url) => {
      const parsed = new URL(url);
      return {
        isValid: ['http:', 'https:'].includes(parsed.protocol),
        error: 'URL must use HTTP or HTTPS protocol'
      };
    },
    message: 'Invalid protocol'
  },
  {
    validate: (url) => {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      const privatePatterns = [
        'localhost',
        '127.0.0.1',
        '192.168.',
        '10.',
        '172.16.',
        '169.254.',
        '[::1]'
      ];
      
      return {
        isValid: !privatePatterns.some(pattern => hostname.includes(pattern)),
        error: 'Local and private URLs are not allowed'
      };
    },
    message: 'Private network access not allowed'
  },
  {
    validate: (url) => ({
      isValid: url.length <= 2000,
      error: 'URL exceeds maximum length of 2000 characters'
    }),
    message: 'URL too long'
  }
];