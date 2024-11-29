export class AnalysisError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public details?: string
  ) {
    super(message);
    this.name = 'AnalysisError';
  }
}