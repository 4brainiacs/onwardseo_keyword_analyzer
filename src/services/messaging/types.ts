export interface MessageOptions {
  timeout?: number;
  retries?: number;
}

export interface MessageContext {
  messageId: string;
  timestamp: number;
  retryCount?: number;
}