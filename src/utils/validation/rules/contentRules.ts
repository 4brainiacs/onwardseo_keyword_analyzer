import type { ValidationRule } from '../types';

export const contentRules: ValidationRule<string>[] = [
  {
    validate: (content) => ({
      isValid: Boolean(content?.trim()),
      error: 'Content cannot be empty'
    }),
    message: 'Empty content'
  },
  {
    validate: (content) => {
      const cleanHtml = content.toLowerCase().trim();
      return {
        isValid: cleanHtml.includes('<!doctype html') || cleanHtml.includes('<html'),
        error: 'Content is not valid HTML'
      };
    },
    message: 'Invalid HTML'
  },
  {
    validate: (content) => {
      const cleanHtml = content.toLowerCase();
      const errorPatterns = [
        '404 not found',
        '403 forbidden',
        '500 internal server error'
      ];
      return {
        isValid: !errorPatterns.some(pattern => cleanHtml.includes(pattern)),
        error: 'URL returns an error page'
      };
    },
    message: 'Error page detected'
  }
];