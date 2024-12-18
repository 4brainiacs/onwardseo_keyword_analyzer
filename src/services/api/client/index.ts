import { ApiClient } from './ApiClient';
import { API_CONFIG } from '../config';
import { RequestHandler } from '../handlers/RequestHandler';
import { ResponseHandler } from '../handlers/ResponseHandler';

// Create singleton instance with dependencies
const requestHandler = new RequestHandler();
const responseHandler = new ResponseHandler();

export const apiClient = new ApiClient(
  API_CONFIG,
  requestHandler,
  responseHandler
);

// Re-export types
export type { ApiConfig } from '../types';
export type { ApiResponse } from '../types';
export type { AnalysisResult } from '../../../types';