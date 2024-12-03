export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateUrl(url: string): ValidationResult {
  if (!url?.trim()) {
    return { isValid: false, error: 'URL is required' };
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
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('169.254.') ||
      hostname === '[::1]'
    ) {
      return { 
        isValid: false, 
        error: 'Local and private URLs are not allowed' 
      };
    }

    // Validate hostname format
    const hostnameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!hostnameRegex.test(hostname)) {
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