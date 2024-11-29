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

export function validateResponse(response) {
  if (!response) {
    throw new Error('No response received');
  }

  // Check response status
  if (!response.ok) {
    const status = response.statusCode;
    
    if (status === 404) {
      throw new Error('Page not found');
    }
    if (status === 403) {
      throw new Error('Access forbidden');
    }
    if (status === 429) {
      throw new Error('Too many requests');
    }
    if (status === 500) {
      throw new Error('Server error');
    }
    if (status === 502) {
      throw new Error('Bad gateway');
    }
    if (status === 503) {
      throw new Error('Service unavailable');
    }
    if (status === 504) {
      throw new Error('Gateway timeout');
    }
    
    throw new Error(`HTTP error! status: ${status}`);
  }

  // Validate content type
  const contentType = response.headers['content-type'];
  if (!contentType) {
    throw new Error('No content type specified in response');
  }

  const normalizedContentType = contentType.toLowerCase();
  if (!normalizedContentType.includes('text/html') && 
      !normalizedContentType.includes('application/xhtml+xml')) {
    throw new Error('Invalid content type: Response must be HTML');
  }

  // Check response body
  if (!response.body) {
    throw new Error('Empty response received');
  }

  // Check for minimal HTML structure
  const body = response.body.toString().toLowerCase();
  if (!body.includes('<html') && !body.includes('<!doctype html')) {
    throw new Error('Invalid HTML: Missing HTML structure');
  }
}