import { logger } from '../../utils/logger/Logger';

interface PerformanceMetrics {
  component: string;
  operation: string;
  duration: number;
  success: boolean;
  timestamp: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 1000;

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  async trackOperation<T>(
    component: string,
    operation: string,
    func: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    let success = false;

    try {
      const result = await func();
      success = true;
      return result;
    } finally {
      const duration = performance.now() - startTime;
      this.recordMetrics({
        component,
        operation,
        duration,
        success,
        timestamp: Date.now()
      });
    }
  }

  private recordMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log slow operations
    if (metrics.duration > 1000) {
      logger.warn('Slow operation detected', {
        component: metrics.component,
        operation: metrics.operation,
        duration: metrics.duration,
        timestamp: new Date(metrics.timestamp).toISOString()
      });
    }
  }

  getMetrics(options: {
    component?: string;
    operation?: string;
    minDuration?: number;
    maxDuration?: number;
    success?: boolean;
    limit?: number;
  } = {}): PerformanceMetrics[] {
    let filtered = this.metrics;

    if (options.component) {
      filtered = filtered.filter(m => m.component === options.component);
    }
    if (options.operation) {
      filtered = filtered.filter(m => m.operation === options.operation);
    }
    if (options.minDuration !== undefined) {
      filtered = filtered.filter(m => m.duration >= options.minDuration!);
    }
    if (options.maxDuration !== undefined) {
      filtered = filtered.filter(m => m.duration <= options.maxDuration!);
    }
    if (options.success !== undefined) {
      filtered = filtered.filter(m => m.success === options.success);
    }

    return filtered.slice(-(options.limit || 100));
  }

  getAverageMetrics(component?: string, operation?: string): {
    avgDuration: number;
    successRate: number;
    totalOperations: number;
  } {
    let metrics = this.metrics;
    
    if (component) {
      metrics = metrics.filter(m => m.component === component);
    }
    if (operation) {
      metrics = metrics.filter(m => m.operation === operation);
    }

    const totalOperations = metrics.length;
    if (totalOperations === 0) {
      return { avgDuration: 0, successRate: 0, totalOperations: 0 };
    }

    const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / totalOperations;
    const successRate = metrics.filter(m => m.success).length / totalOperations;

    return { avgDuration, successRate, totalOperations };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();