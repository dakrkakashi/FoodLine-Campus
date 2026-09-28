/**
 * FoodLine Campus — High-Precision Performance Metrics & Latency Profiler
 * Collects rolling window request and database query timings with P50/P95/P99 percentile calculation.
 */

export interface LatencyPercentiles {
  count: number;
  minMs: number;
  maxMs: number;
  avgMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
}

export interface RouteMetricsSummary {
  route: string;
  totalRequests: number;
  latencies: LatencyPercentiles;
}

export interface SystemPerformanceMetrics {
  timestamp: string;
  uptimeSeconds: number;
  globalApi: LatencyPercentiles;
  routes: Record<string, LatencyPercentiles>;
  database: Record<string, LatencyPercentiles>;
  targets: {
    criticalApiP50Ms: number;
    criticalApiP95Ms: number;
    criticalApiP99Ms: number;
    databaseP95Ms: number;
    maxQueryDurationMs: number;
  };
}

class MetricsService {
  private static readonly MAX_WINDOW_SIZE = 1000;
  private globalTimings: number[] = [];
  private routeTimings: Map<string, number[]> = new Map();
  private dbTimings: Map<string, number[]> = new Map();

  /**
   * Record an API request latency
   */
  public recordApiLatency(route: string, durationMs: number): void {
    // Record globally
    this.addTiming(this.globalTimings, durationMs);

    // Record per normalized route
    const normalizedRoute = this.normalizeRoute(route);
    let routeList = this.routeTimings.get(normalizedRoute);
    if (!routeList) {
      routeList = [];
      this.routeTimings.set(normalizedRoute, routeList);
    }
    this.addTiming(routeList, durationMs);
  }

  /**
   * Record a Database operation latency
   */
  public recordDbLatency(operation: string, durationMs: number): void {
    let dbList = this.dbTimings.get(operation);
    if (!dbList) {
      dbList = [];
      this.dbTimings.set(operation, dbList);
    }
    this.addTiming(dbList, durationMs);
  }

  /**
   * Compute percentiles from a list of durations
   */
  public calculatePercentiles(samples: number[]): LatencyPercentiles {
    if (samples.length === 0) {
      return { count: 0, minMs: 0, maxMs: 0, avgMs: 0, p50Ms: 0, p95Ms: 0, p99Ms: 0 };
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const count = sorted.length;
    const minMs = Math.round(sorted[0] * 100) / 100;
    const maxMs = Math.round(sorted[count - 1] * 100) / 100;
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    const avgMs = Math.round((sum / count) * 100) / 100;
    const p50Ms = Math.round(sorted[Math.floor(count * 0.5)] * 100) / 100;
    const p95Ms = Math.round(sorted[Math.floor(count * 0.95)] * 100) / 100;
    const p99Ms = Math.round(sorted[Math.floor(count * 0.99)] * 100) / 100;

    return { count, minMs, maxMs, avgMs, p50Ms, p95Ms, p99Ms };
  }

  /**
   * Retrieve all computed performance metrics
   */
  public getMetricsSummary(): SystemPerformanceMetrics {
    const routeSummaries: Record<string, LatencyPercentiles> = {};
    for (const [route, samples] of this.routeTimings.entries()) {
      routeSummaries[route] = this.calculatePercentiles(samples);
    }

    const dbSummaries: Record<string, LatencyPercentiles> = {};
    for (const [op, samples] of this.dbTimings.entries()) {
      dbSummaries[op] = this.calculatePercentiles(samples);
    }

    return {
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      globalApi: this.calculatePercentiles(this.globalTimings),
      routes: routeSummaries,
      database: dbSummaries,
      targets: {
        criticalApiP50Ms: 200,
        criticalApiP95Ms: 1000,
        criticalApiP99Ms: 2000,
        databaseP95Ms: 100,
        maxQueryDurationMs: 1000,
      },
    };
  }

  /**
   * Reset timings (useful in test runs)
   */
  public reset(): void {
    this.globalTimings = [];
    this.routeTimings.clear();
    this.dbTimings.clear();
  }

  private addTiming(list: number[], durationMs: number): void {
    list.push(durationMs);
    if (list.length > MetricsService.MAX_WINDOW_SIZE) {
      list.shift();
    }
  }

  private normalizeRoute(route: string): string {
    return route
      .replace(/\/order\/FL-[0-9]+/g, '/order/:token')
      .replace(/\/order\/[a-f0-9-]{36}/g, '/order/:token')
      .replace(/\/campuses\/[a-f0-9-]{36}/g, '/campuses/:id')
      .replace(/\/orders\/[a-f0-9-]{36}/g, '/orders/:id')
      .replace(/\/inventory\/[a-f0-9-]{36}/g, '/inventory/:id')
      .split('?')[0];
  }
}

export const metricsService = new MetricsService();
