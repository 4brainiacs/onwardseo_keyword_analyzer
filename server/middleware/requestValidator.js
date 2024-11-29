import { URL } from 'url';

const BLOCKED_DOMAINS = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '[::1]',
  'example.com',
  'example.org',
  'example.net'
]);

const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^fc00:/,
  /^fe80:/
];

export function validateAnalyzeRequest(req, res, next) {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'URL is required'
    });
  }

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    // Check blocked domains
    if (BLOCKED_DOMAINS.has(hostname)) {
      return res.status(400).json({
        success: false,
        error: 'This domain is not allowed'
      });
    }

    // Check private IP patterns
    if (PRIVATE_IP_PATTERNS.some(pattern => pattern.test(hostname))) {
      return res.status(400).json({
        success: false,
        error: 'Private and local networks are not allowed'
      });
    }

    // Check protocol
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        success: false,
        error: 'Only HTTP and HTTPS protocols are allowed'
      });
    }

    // Check URL length
    if (url.length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'URL exceeds maximum length of 2000 characters'
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL format'
    });
  }
}