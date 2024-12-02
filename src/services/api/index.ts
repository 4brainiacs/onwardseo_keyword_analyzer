import { ApiClient } from './client';
import { ApiService } from './service';
import { logger } from '../../utils/logger';
import type { AnalysisResult } from '../../types';

// Create singleton instances
export const apiClient = new ApiClient();
export const apiService = new ApiService(apiClient);

// Re-export types and classes
export * from './types';
export * from './client';
export * from './service';

// Main API function
export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
    logger.info('Starting URL analysis', { url });
    return await apiService.analyzeUrl(url);
  } catch (error) {
    logger.error('Analysis failed:', error);
    throw error;
  }
}