import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';

export function errorHandler(err, req, res, next) {
  logger.error('Express error:', err);

  // Handle specific error types
  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
    return res.status(StatusCodes.GATEWAY_TIMEOUT).json({
      success: false,
      error: 'Request timeout',
      details: 'The website took too long to respond',
      retryable: true,
      retryAfter: 5000
    });
  }

  if (err.code === 'ENOTFOUND') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: 'Website not found',
      details: 'The website could not be reached',
      retryable: false
    });
  }

  if (err.name === 'AnalysisError') {
    return res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: err.message,
      details: err.details,
      retryable: err.retryable,
      retryAfter: err.retryAfter
    });
  }

  // Default error response
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: 'Analysis failed',
    details: err.message || 'An unexpected error occurred',
    retryable: true,
    retryAfter: 5000
  });
}