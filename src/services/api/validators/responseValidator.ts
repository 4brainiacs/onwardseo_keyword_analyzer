import { AnalysisError } from '../../errors';
import type { ApiResponse } from '../types';

export function validateResponse<T>(
  response: Response, 
  data: ApiResponse<T>
): T {
  if (!response.ok) {
    throw new AnalysisError(
      data.error || 'Request failed',
      response.status,
      data.details || `Server returned status ${response.status}`,
      response.status >= 500
    );
  }

  if (!data.success || !data.data) {
    throw new AnalysisError(
      'Invalid response format',
      500,
      'Server returned an unexpected response format',
      true
    );
  }

  return data.data;
}