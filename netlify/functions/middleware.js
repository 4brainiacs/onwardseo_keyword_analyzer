import express from 'express';
import cors from 'cors';
import { responseFormatter } from './middleware/responseFormatter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Request-ID']
}));

// Parse JSON bodies
app.use(express.json());

// Response formatting middleware
app.use(responseFormatter);

// Error handling middleware
app.use(errorHandler);

export const handler = app;