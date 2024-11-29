import got from 'got';
import pTimeout from 'p-timeout';
import retry from 'retry';

export class Scraper {
  constructor() {
    this.timeout = 30000; // 30 seconds
  }

  async fetch(url) {
    const operation = retry.operation({
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 10000
    });

    return new Promise((resolve, reject) => {
      operation.attempt(async (currentAttempt) => {
        try {
          const timeoutPromise = pTimeout(
            got(url, {
              timeout: {
                request: this.timeout,
                response: this.timeout
              },
              retry: { limit: 0 },
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.5'
              },
              followRedirect: true,
              maxRedirects: 5
            }).text(),
            {
              milliseconds: this.timeout,
              message: 'Request timed out'
            }
          );

          const response = await timeoutPromise;
          resolve(response);
        } catch (error) {
          if (operation.retry(error)) {
            return;
          }
          
          reject(operation.mainError() || error);
        }
      });
    });
  }
}