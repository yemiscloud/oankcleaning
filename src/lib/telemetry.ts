/**
 * OANK Cleaning Performance & Telemetry Engine
 *
 * Provides:
 * 1. Modern JavaScript & Resource Efficiency
 * 2. Console Data Capture (Error & Warning Ring-Buffer, Unhandled Rejection Capture)
 * 3. Network Data Capture (Latency, Request Sizing, Error Rates, Retry Tracking)
 * 4. Core Web Vitals Monitoring (FCP, LCP, CLS, TBT, TTFB)
 */

export interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint (ms)
  lcp: number | null; // Largest Contentful Paint (ms)
  cls: number;        // Cumulative Layout Shift score
  tbt: number;        // Total Blocking Time estimate (ms)
  ttfb: number | null; // Time to First Byte (ms)
  domInteractive: number | null;
  domComplete: number | null;
  rating: {
    fcp: 'good' | 'needs-improvement' | 'poor' | 'pending';
    lcp: 'good' | 'needs-improvement' | 'poor' | 'pending';
    cls: 'good' | 'needs-improvement' | 'poor';
    tbt: 'good' | 'needs-improvement' | 'poor';
  };
}

export interface NetworkLogEntry {
  id: string;
  url: string;
  method: string;
  status: number | null;
  durationMs: number;
  timestamp: string;
  success: boolean;
  sizeBytes?: number;
  errorMessage?: string;
}

export interface ConsoleLogEntry {
  id: string;
  type: 'error' | 'warn' | 'info' | 'unhandledrejection';
  message: string;
  stack?: string;
  timestamp: string;
}

class TelemetryService {
  private static instance: TelemetryService;

  private networkLogs: NetworkLogEntry[] = [];
  private consoleLogs: ConsoleLogEntry[] = [];
  private maxLogs = 50;

  private metrics: PerformanceMetrics = {
    fcp: null,
    lcp: null,
    cls: 0,
    tbt: 0,
    ttfb: null,
    domInteractive: null,
    domComplete: null,
    rating: {
      fcp: 'pending',
      lcp: 'pending',
      cls: 'good',
      tbt: 'good',
    },
  };

  private isInitialized = false;

  private constructor() {}

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  /**
   * Initialize Global Telemetry, Observers & Interceptors
   */
  public init() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }
    this.isInitialized = true;

    this.setupConsoleCapture();
    this.setupUnhandledExceptionCapture();
    this.setupWebVitalsObservers();
  }

  /**
   * 1. Console Data Capture
   */
  private setupConsoleCapture() {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args: unknown[]) => {
      originalConsoleError.apply(console, args);
      try {
        const message = args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' ');
        this.addConsoleLog('error', message);
      } catch {
        // Silently avoid telemetry recursion
      }
    };

    console.warn = (...args: unknown[]) => {
      originalConsoleWarn.apply(console, args);
      try {
        const message = args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a)))
          .join(' ');
        this.addConsoleLog('warn', message);
      } catch {
        // Silently avoid telemetry recursion
      }
    };
  }

  private setupUnhandledExceptionCapture() {
    window.addEventListener('error', (event) => {
      this.addConsoleLog(
        'error',
        event.message || 'Unknown window error',
        event.error?.stack
      );
    });

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      const message =
        typeof reason === 'string'
          ? reason
          : reason?.message || 'Unhandled Promise Rejection';
      this.addConsoleLog('unhandledrejection', message, reason?.stack);
    });
  }

  private addConsoleLog(
    type: ConsoleLogEntry['type'],
    message: string,
    stack?: string
  ) {
    const entry: ConsoleLogEntry = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      type,
      message: message.slice(0, 500), // sanitize / limit length
      stack: stack ? stack.slice(0, 1000) : undefined,
      timestamp: new Date().toISOString(),
    };

    this.consoleLogs.unshift(entry);
    if (this.consoleLogs.length > this.maxLogs) {
      this.consoleLogs.pop();
    }

    // Persist severe runtime failures in localStorage for diagnostic resilience
    if (type === 'error' || type === 'unhandledrejection') {
      try {
        const key = 'oank_telemetry_errors';
        const stored = JSON.parse(localStorage.getItem(key) || '[]');
        stored.unshift(entry);
        localStorage.setItem(key, JSON.stringify(stored.slice(0, 10)));
      } catch {
        // Ignore quota errors
      }
    }
  }

  /**
   * 2. Network Data Capture
   */
  public recordNetworkRequest(entry: Omit<NetworkLogEntry, 'id' | 'timestamp'>) {
    const log: NetworkLogEntry = {
      ...entry,
      id: 'net-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    };

    this.networkLogs.unshift(log);
    if (this.networkLogs.length > this.maxLogs) {
      this.networkLogs.pop();
    }
  }

  /**
   * 3. Performance & Web Vitals Observers (FCP, LCP, CLS, TBT, TTFB)
   */
  private setupWebVitalsObservers() {
    // Navigation timing for TTFB
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
          if (navEntries && navEntries.length > 0) {
            const nav = navEntries[0];
            this.metrics.ttfb = Math.round(nav.responseStart - nav.requestStart);
            this.metrics.domInteractive = Math.round(nav.domInteractive);
            this.metrics.domComplete = Math.round(nav.domComplete);
          }
        }, 0);
      });
    }

    if (!('PerformanceObserver' in window)) {
      return;
    }

    // A. First Contentful Paint (FCP)
    try {
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const fcp = Math.round(entry.startTime);
            this.metrics.fcp = fcp;
            this.metrics.rating.fcp = fcp <= 1800 ? 'good' : fcp <= 3000 ? 'needs-improvement' : 'poor';
          }
        }
      });
      paintObserver.observe({ type: 'paint', buffered: true });
    } catch {
      // Observer type unsupported
    }

    // B. Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1];
          const lcp = Math.round(lastEntry.startTime);
          this.metrics.lcp = lcp;
          this.metrics.rating.lcp = lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor';
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // Observer unsupported
    }

    // C. Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      let sessionEntries: PerformanceEntry[] = [];
      let sessionValue = 0;

      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          // Only count layout shifts without recent user input
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (
              sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              this.metrics.cls = Math.round(clsValue * 1000) / 1000;
              this.metrics.rating.cls =
                this.metrics.cls <= 0.1 ? 'good' : this.metrics.cls <= 0.25 ? 'needs-improvement' : 'poor';
            }
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch {
      // Observer unsupported
    }

    // D. Total Blocking Time (TBT) Approximation via Long Tasks
    try {
      let tbtSum = 0;
      const longTaskObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Long tasks are tasks > 50ms
          const blockingTime = entry.duration - 50;
          if (blockingTime > 0) {
            tbtSum += blockingTime;
            this.metrics.tbt = Math.round(tbtSum);
            this.metrics.rating.tbt =
              this.metrics.tbt <= 200 ? 'good' : this.metrics.tbt <= 600 ? 'needs-improvement' : 'poor';
          }
        }
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
    } catch {
      // Longtask unsupported
    }
  }

  /**
   * Query Telemetry Data
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getNetworkLogs(): NetworkLogEntry[] {
    return [...this.networkLogs];
  }

  public getConsoleLogs(): ConsoleLogEntry[] {
    return [...this.consoleLogs];
  }

  public getNetworkStats() {
    if (this.networkLogs.length === 0) {
      return { total: 0, successCount: 0, failureCount: 0, avgDurationMs: 0 };
    }
    const total = this.networkLogs.length;
    const successCount = this.networkLogs.filter((n) => n.success).length;
    const failureCount = total - successCount;
    const sumDuration = this.networkLogs.reduce((acc, curr) => acc + curr.durationMs, 0);
    return {
      total,
      successCount,
      failureCount,
      avgDurationMs: Math.round(sumDuration / total),
    };
  }
}

export const telemetry = TelemetryService.getInstance();
