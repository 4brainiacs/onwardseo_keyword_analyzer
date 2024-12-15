import type { ValidationResult } from './types';

export class UrlValidator {
  validate(url: string): ValidationResult {
    if (!url?.trim()) {
      return {
        isValid: false,
        error: 'URL is required'
      };
    }

    try {
      const parsed = new URL(url);
      
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return {
          isValid: false,
          error: 'URL must use HTTP or HTTPS protocol'
        };
      }

      // Block localhost and private IPs
      const hostname = parsed.hostname.toLowerCase();
      if (this.isPrivateHostname(hostname)) {
        return {
          isValid: false,
          error: 'Local and private URLs are not allowed'
        };
      }

      // Validate hostname format
      if (!this.isValidHostname(hostname)) {
        return {
          isValid: false,
          error: 'Invalid hostname format'
        };
      }

      // Length validation
      if (url.length > 2000) {
        return {
          isValid: false,
          error: 'URL exceeds maximum length of 2000 characters'
        };
      }

      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: 'Invalid URL format'
      };
    }
  }

  private isPrivateHostname(hostname: string): boolean {
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('169.254.') ||
      hostname === '[::1]'
    );
  }

  private isValidHostname(hostname: string): boolean {
    const hostnameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    return hostnameRegex.test(hostname);
  }
}