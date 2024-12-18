import { AnalysisError } from '../../errors';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import type { ValidationResult } from '../types';

export class UrlValidator {
  validate(url: string): ValidationResult {
    if (!url?.trim()) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.VALIDATION.MISSING_URL
      };
    }

    try {
      const parsed = new URL(url);
      
      if (!this.isValidProtocol(parsed.protocol)) {
        return {
          isValid: false,
          error: ERROR_MESSAGES.VALIDATION.INVALID_PROTOCOL
        };
      }

      if (this.isPrivateHostname(parsed.hostname)) {
        return {
          isValid: false,
          error: ERROR_MESSAGES.VALIDATION.PRIVATE_URL
        };
      }

      if (!this.isValidHostname(parsed.hostname)) {
        return {
          isValid: false,
          error: ERROR_MESSAGES.VALIDATION.INVALID_HOSTNAME
        };
      }

      if (url.length > 2000) {
        return {
          isValid: false,
          error: ERROR_MESSAGES.VALIDATION.URL_TOO_LONG
        };
      }

      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: ERROR_MESSAGES.VALIDATION.INVALID_URL
      };
    }
  }

  private isValidProtocol(protocol: string): boolean {
    return ['http:', 'https:'].includes(protocol);
  }

  private isPrivateHostname(hostname: string): boolean {
    const privatePatterns = [
      'localhost',
      '127.0.0.1',
      '192.168.',
      '10.',
      '172.16.',
      '169.254.',
      '[::1]'
    ];

    return privatePatterns.some(pattern => hostname.includes(pattern));
  }

  private isValidHostname(hostname: string): boolean {
    const hostnameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    return hostnameRegex.test(hostname);
  }
}