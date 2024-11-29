export const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err);

  // Handle specific error types
  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
    return res.status(504).json({
      success: false,
      error: 'Request timeout',
      details: 'The website took too long to respond'
    });
  }

  if (err.code === 'ENOTFOUND') {
    return res.status(400).json({
      success: false,
      error: 'Website not found',
      details: 'The website could not be reached'
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: 'Analysis failed',
    details: err.message || 'An unexpected error occurred'
  });
};