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

    return { isValid: true };
  } catch {
    return { 
      isValid: false, 
      error: 'Invalid URL format' 
    };
  }
}