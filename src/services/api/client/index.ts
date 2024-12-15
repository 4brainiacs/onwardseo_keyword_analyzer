import { ApiClient } from './ApiClient';
import { RequestHandler } from '../handlers/RequestHandler';
import { ResponseHandler } from '../handlers/ResponseHandler';
import { API_CONFIG } from '../../../config/api';

// Create instances of required dependencies
const requestHandler = new RequestHandler();
const responseHandler = new ResponseHandler();

// Create and export the singleton instance
export const apiClient = new ApiClient(
  API_CONFIG,
  requestHandler,
  responseHandler
);

// Also export the class for testing/mocking
export { ApiClient };