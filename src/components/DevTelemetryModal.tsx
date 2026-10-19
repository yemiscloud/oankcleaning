import React, { useState } from 'react';
import { telemetry, PerformanceMetrics, ConsoleLogEntry, NetworkLogEntry } from '../lib/telemetry';

export const DevTelemetryModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'vitals' | 'console' | 'network'>('vitals');
  const [vitals, setVitals] = useState<PerformanceMetrics>(telemetry.getPerformanceMetrics());
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogEntry[]>(telemetry.getConsoleLogs());
  const [networkLogs, setNetworkLogs] = useState<NetworkLogEntry[]>(telemetry.getNetworkLogs());

  // Only render in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  const refreshData = () => {
    setVitals(telemetry.getPerformanceMetrics());
    setConsoleLogs(telemetry.getConsoleLogs());
    setNetworkLogs(telemetry.getNetworkLogs());
  };

  const handleOpen = () => {
    refreshData();
    setIsOpen(true);
  };

  return (
    <>
      {/* Dev Mode Floating Trigger Button */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={handleOpen}
          className="bg-slate-900/90 hover:bg-slate-950 backdrop-blur-md text-emerald-400 font-mono text-[11px] font-semibold px-3 py-2 rounded-xl shadow-lg border border-slate-700/80 transition-all flex items-center gap-2 cursor-pointer group"
          title="Inspect Web Vitals, Console & Network Telemetry (Development Mode Only)"
          aria-label="Inspect Core Web Vitals, Console and Network Telemetry"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200 group-hover:text-white">Telemetry & Vitals (Dev)</span>
        </button>
      </div>

      {/* Dev Mode Telemetry Inspector Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono">
                  DEV
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Performance & Telemetry Center</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Development Mode · Web Vitals · Console · Network</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshData}
                  className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors cursor-pointer"
                >
                  Refresh
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs font-medium">
              <button
                onClick={() => setActiveTab('vitals')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'vitals'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Core Web Vitals
              </button>
              <button
                onClick={() => setActiveTab('console')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'console'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Console Capture ({consoleLogs.length})
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'network'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Network Capture ({networkLogs.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {activeTab === 'vitals' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-[10px] text-slate-500 font-mono uppercase">FCP (Paint)</p>
                      <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                        {vitals.fcp !== null ? `${vitals.fcp}ms` : 'Recorded'}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Threshold &lt; 1800ms</p>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-[10px] text-slate-500 font-mono uppercase">LCP (Contentful)</p>
                      <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                        {vitals.lcp !== null ? `${vitals.lcp}ms` : 'Recorded'}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Threshold &lt; 2500ms</p>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-[10px] text-slate-500 font-mono uppercase">CLS (Layout Shift)</p>
                      <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                        {vitals.cls}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Threshold &le; 0.100</p>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-[10px] text-slate-500 font-mono uppercase">TBT (Blocking)</p>
                      <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                        {vitals.tbt}ms
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Threshold &lt; 200ms</p>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1.5 text-emerald-950">
                    <p className="font-semibold text-emerald-900">Optimization Invariants Active:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-800">
                      <li>Non-critical page routes code-split via <code>React.lazy</code></li>
                      <li>Rollup vendor chunk separation (React, Icons, Motion isolated)</li>
                      <li>Critical hero image preloaded in <code>index.html</code> with <code>fetchpriority="high"</code></li>
                      <li>Google Fonts non-blocking asynchronous load with font-display swap</li>
                      <li>Zero layout shifts enforced with fixed image aspect-ratio containers</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'console' && (
                <div className="space-y-2">
                  {consoleLogs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No console errors or warnings captured. Runtime is clean.
                    </div>
                  ) : (
                    consoleLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-3 rounded-lg border text-xs font-mono ${
                          log.type === 'error' || log.type === 'unhandledrejection'
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : 'bg-amber-50 border-amber-200 text-amber-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold uppercase text-[10px]">{log.type}</span>
                          <span className="text-[10px] opacity-70">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="break-all">{log.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'network' && (
                <div className="space-y-2">
                  {networkLogs.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No network requests captured yet. Submit a quote or contact enquiry to track real network latency.
                    </div>
                  ) : (
                    networkLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{log.method}</span>
                            <span className="text-slate-600">{log.url}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(log.timestamp).toLocaleTimeString()} · Status: {log.status || 'Pending/Failed'}
                          </p>
                        </div>
                        <span className="font-semibold text-emerald-700">{log.durationMs}ms</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
