import { AnalysisError } from '../../errors';
import { logger } from '../../../utils/logger';

export class ApiResponseValidator {
  async validateResponse(response: Response): Promise<void> {
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      let errorDetails = response.statusText;

      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
          errorDetails = errorData.details || errorDetails;
        }
      } catch {
        // Use default error message if JSON parsing fails
      }

      throw new AnalysisError(
        errorMessage,
        response.status,
        errorDetails,
        response.status >= 500
      );
    }
  }

  validateApiResponse<T>(data: unknown): T {
    if (!data || typeof data !== 'object') {
      throw new AnalysisError(
        'Invalid response format',
        500,
        'Server returned unexpected data format',
        true
      );
    }

    const apiResponse = data as any;
    
    if (!apiResponse.success || !apiResponse.data) {
      throw new AnalysisError(
        apiResponse.error || 'Request failed',
        apiResponse.status || 500,
        apiResponse.details || 'Server returned unsuccessful response',
        apiResponse.retryable || false,
        apiResponse.retryAfter
      );
    }

    return apiResponse.data;
  }
}