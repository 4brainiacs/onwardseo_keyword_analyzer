export class MessageError extends Error {
  constructor(
    message: string,
    public readonly details?: string
  ) {
    super(message);
    this.name = 'MessageError';
    Error.captureStackTrace(this, this.constructor);
  }

  static fromError(error: unknown): MessageError {
    if (error instanceof MessageError) {
      return error;
    }
    return new MessageError(
      error instanceof Error ? error.message : 'Message channel error'
    );
  }
}