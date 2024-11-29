export function validateUrl(url: string): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const trimmedUrl = url.trim();
    const parsedUrl = new URL(trimmedUrl);
    
    // Protocol validation
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { 
        isValid: false, 
        error: 'URL must use HTTP or HTTPS protocol' 
      };
    }

    // Hostname validation
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Block localhost and private IPs
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.16.') ||
      hostname.startsWith('169.254.') ||
      hostname === '[::1]' ||
      hostname.startsWith('0.') ||
      hostname.startsWith('fc00:') ||
      hostname.startsWith('fe80:')
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
    if (trimmedUrl.length > 2000) {
      return { 
        isValid: false, 
        error: 'URL exceeds maximum length of 2000 characters' 
      };
    }

    // Port validation
    if (parsedUrl.port && !['80', '443', ''].includes(parsedUrl.port)) {
      return { 
        isValid: false, 
        error: 'Only standard HTTP(S) ports are allowed' 
      };
    }

    // Path validation
    if (parsedUrl.pathname.includes('..')) {
      return {
        isValid: false,
        error: 'Invalid URL path'
      };
    }

    // Query string validation
    if (parsedUrl.search && parsedUrl.search.length > 1000) {
      return {
        isValid: false,
        error: 'Query string too long'
      };
    }

    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Invalid URL format. Please include http:// or https://' 
    };
  }
}