import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { AnalysisError } from './errors';

export class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.axiosInstance = axios.create({
      timeout: 30000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      ...config
    });
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.code === 'ECONNABORTED') {
          throw new AnalysisError(
            'Request timed out',
            408,
            'The server took too long to respond. Please try again.'
          );
        }

        if (!axiosError.response) {
          throw new AnalysisError(
            'Network error',
            0,
            'Could not connect to the server. Please check your internet connection.'
          );
        }

        const status = axiosError.response.status;
        const data = axiosError.response.data as any;

        throw new AnalysisError(
          data?.error || 'Request failed',
          status,
          data?.details || axiosError.message
        );
      }

      throw new AnalysisError(
        'Request failed',
        500,
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
}