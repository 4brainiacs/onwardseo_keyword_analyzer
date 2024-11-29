export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface ApiError {
  error: string;
  details?: string;
  status?: number;
}