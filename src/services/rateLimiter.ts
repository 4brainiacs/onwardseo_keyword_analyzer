interface RateLimiterConfig {
  maxRequests: number;
  timeWindow: number;
}

interface RequestRecord {
  timestamp: number;
}

export class RateLimiter {
  private requests: RequestRecord[] = [];
  private config: RateLimiterConfig;

  constructor(config: RateLimiterConfig) {
    this.config = config;
  }

  canMakeRequest(): boolean {
    this.clearOldRequests();
    return this.requests.length < this.config.maxRequests;
  }

  recordRequest(): void {
    this.clearOldRequests();
    this.requests.push({ timestamp: Date.now() });
  }

  private clearOldRequests(): void {
    const cutoff = Date.now() - this.config.timeWindow;
    this.requests = this.requests.filter(req => req.timestamp > cutoff);
  }

  getRemainingRequests(): number {
    this.clearOldRequests();
    return Math.max(0, this.config.maxRequests - this.requests.length);
  }

  getTimeUntilReset(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests.map(r => r.timestamp));
    return Math.max(0, oldestRequest + this.config.timeWindow - Date.now());
  }
}