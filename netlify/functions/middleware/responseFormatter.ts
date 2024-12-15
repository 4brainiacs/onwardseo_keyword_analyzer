import { logger } from '../utils/logger';

export function responseFormatter(req: any, res: any, next: any) {
  const originalJson = res.json;
  
  res.json = function(body: any) {
    // Always set proper content type
    res.setHeader('Content-Type', 'application/json');

    // Ensure we always have a response object
    const response = {
      success: !body.error,
      ...(!body.error ? { 
        data: body 
      } : { 
        error: body.error,
        details: body.details,
        retryable: body.retryable,
        retryAfter: body.retryAfter
      }),
      timestamp: new Date().toISOString()
    };

    // Log response for debugging
    logger.debug('Formatting response:', {
      success: response.success,
      hasError: !!body.error,
      contentLength: JSON.stringify(response).length,
      url: req.body?.url
    });

    // Validate response before sending
    if (!response.success && !response.error) {
      logger.error('Invalid error response format:', response);
      return originalJson.call(this, {
        success: false,
        error: 'Internal server error',
        details: 'The server generated an invalid response format',
        retryable: true,
        retryAfter: 5000
      });
    }

    return originalJson.call(this, response);
  };

  next();
}