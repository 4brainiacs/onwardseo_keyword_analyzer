import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeController } from './controllers/analyzeController.js';
import { validateAnalyzeRequest } from './middleware/requestValidator.js';
import { errorHandler } from './middleware/errorHandler.js';
import rateLimit from 'express-rate-limit';

// Load environment variables first
dotenv.config();

// Validate required environment variables
if (!process.env.SCRAPINGBEE_API_KEY) {
  console.error('Missing required environment variable: SCRAPINGBEE_API_KEY');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 9999;

// Basic middleware
app.use(cors());
app.use(express.json());

// Configure rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests',
    details: 'Please try again later'
  }
});

// Apply rate limiter to all requests
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main analysis endpoint
app.post('/analyze', validateAnalyzeRequest, analyzeController);

// Error handler must be last
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});