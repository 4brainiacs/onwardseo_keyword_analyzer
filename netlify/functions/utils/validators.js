export function validateUrl(url) {
  if (!url) {
    return { 
      isValid: false, 
      error: 'URL is required' 
    };
  }

  try {
    const parsedUrl = new URL(url);
    
    // Protocol validation
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return { 
        isValid: false, 
        error: 'URL must use HTTP or HTTPS protocol' 
      };
    }

    // Block localhost and private IPs
    const hostname = parsedUrl.hostname.toLowerCase();
    if (isPrivateOrLocalhost(hostname)) {
      return { 
        isValid: false, 
        error: 'Local and private URLs are not allowed' 
      };
    }

    // Check URL length
    if (url.length > 2000) {
      return {
        isValid: false,
        error: 'URL exceeds maximum length of 2000 characters'
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

    return { isValid: true };
  } catch {
    return { 
      isValid: false, 
      error: 'Invalid URL format' 
    };
  }
}

function isPrivateOrLocalhost(hostname) {
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