export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: string,
    public readonly retryable: boolean = false,
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}