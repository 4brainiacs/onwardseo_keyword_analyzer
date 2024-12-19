import { logger } from '../../utils/logger';
import { MessageError } from './MessageError';
import type { MessageOptions } from './types';

export class MessageChannel {
  private static timeoutDuration = 30000;
  private static timeouts = new Map<string, NodeJS.Timeout>();

  static async send<T>(
    operation: () => Promise<T>,
    messageId: string,
    options: MessageOptions = {}
  ): Promise<T> {
    try {
      this.clearTimeout(messageId);
      const timeoutPromise = this.createTimeout(messageId);

      const result = await Promise.race([
        operation(),
        timeoutPromise
      ]);

      this.clearTimeout(messageId);
      return result;
    } catch (error) {
      logger.error('Message send failed:', { error, messageId });
      throw MessageError.fromError(error);
    }
  }

  private static createTimeout(messageId: string): Promise<never> {
    return new Promise((_, reject) => {
      const timeout = setTimeout(() => {
        this.clearTimeout(messageId);
        reject(new MessageError('Message timeout'));
      }, this.timeoutDuration);
      
      this.timeouts.set(messageId, timeout);
    });
  }

  private static clearTimeout(messageId: string): void {
    const timeout = this.timeouts.get(messageId);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(messageId);
    }
  }
}