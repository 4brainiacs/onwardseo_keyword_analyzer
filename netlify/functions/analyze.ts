import express from 'express';
import cors from 'cors';
import { analyzeContent } from './services/analyzer';
import { logger } from './utils/logger';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Request-ID']
}));

app.use(express.json());

app.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
        details: 'Please provide a URL to analyze'
      });
    }

    const result = await analyzeContent(url);

    return res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Analysis error:', error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Analysis failed',
      details: error.details || 'An unexpected error occurred',
      retryable: error.retryable || error.status >= 500,
      retryAfter: error.retryAfter || 5000
    });
  }
});

export const handler = app;