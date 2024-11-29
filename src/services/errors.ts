export class AnalysisError extends Error {
  constructor(
    message: string,
    public status = 500,
    public details?: string,
    public retryable = false,
    public timeout?: number,
    public rawResponse?: string
  ) {
    super(message);
    this.name = 'AnalysisError';
  }
}