import { ApiClient } from './api/client/ApiClient';
import { RequestHandler } from './api/handlers/RequestHandler';
import { ResponseHandler } from './api/handlers/ResponseHandler';
import { API_CONFIG } from '../config/api';

// Create singleton instance with dependencies
const requestHandler = new RequestHandler();
const responseHandler = new ResponseHandler();

export const apiClient = new ApiClient(
  API_CONFIG,
  requestHandler,
  responseHandler
);

// Re-export types
export type { ApiConfig } from '../config/api';
export type { ApiResponse } from './api/types';
export type { AnalysisResult } from '../types';