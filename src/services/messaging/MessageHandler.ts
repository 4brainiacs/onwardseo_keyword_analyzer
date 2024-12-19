import { logger } from '../../utils/logger';

export class MessageHandler {
  private static timeoutDuration = 30000; // 30 seconds
  private static timeouts = new Map<string, NodeJS.Timeout>();

  static async handleMessage<T>(
    operation: () => Promise<T>,
    messageId: string
  ): Promise<T> {
    try {
      // Clear any existing timeout for this messageId
      this.clearTimeout(messageId);

      // Set new timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeout = setTimeout(() => {
          this.clearTimeout(messageId);
          reject(new Error('Message channel timeout'));
        }, this.timeoutDuration);
        
        this.timeouts.set(messageId, timeout);
      });

      // Race between operation and timeout
      const result = await Promise.race([
        operation(),
        timeoutPromise
      ]);

      // Clear timeout on success
      this.clearTimeout(messageId);
      return result;

    } catch (error) {
      logger.error('Message handling failed:', { error, messageId });
      throw error;
    }
  }

  private static clearTimeout(messageId: string): void {
    const timeout = this.timeouts.get(messageId);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(messageId);
    }
  }
}