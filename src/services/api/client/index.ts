import { ApiClient } from './ApiClient';
import { API_CONFIG } from '../config';

// Create singleton instance
export const apiClient = new ApiClient();

// Export types and constants
export type { ApiClient };
export { API_CONFIG };