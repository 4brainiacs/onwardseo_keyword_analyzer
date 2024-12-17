```typescript
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp?: string;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: string;
  status?: number;
  retryable?: boolean;
  retryAfter?: number;
  code?: string;
  timestamp?: string;
  requestId?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```