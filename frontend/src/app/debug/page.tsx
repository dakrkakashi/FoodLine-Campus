'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity,
  Terminal,
  Server,
  Database,
  Cpu,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  CreditCard,
  Lock,
  SearchX,
  Clock,
  Users,
  FileX,
  Flame,
  ServerCrash,
  WifiOff,
  Coffee,
  Hourglass,
  Trash2,
  Bug,
  Compass,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Home,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import { HTTP_ERRORS_CATALOG, ErrorMetadata } from '@/lib/errors-catalog';
import { ErrorView } from '@/components/ui/error-view';

export default function DebugDashboardPage() {
  const [healthStatus, setHealthStatus] = useState<{
    backend: 'checking' | 'online' | 'offline';
    latencyMs: number;
    dbStatus: string;
    checkedAt: string;
  }>({
    backend: 'checking',
    latencyMs: 0,
    dbStatus: 'Checking...',
    checkedAt: 'Just now',
  });

  const [previewError, setPreviewError] = useState<ErrorMetadata | null>(null);
  const [shouldCrash, setShouldCrash] = useState(false);
  const [storageItems, setStorageItems] = useState<{ key: string; value: string }[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Crash simulator
  if (shouldCrash) {
    throw new Error('🧪 Deliberate test crash triggered from /debug dashboard to test error.tsx boundary!');
  }

  const checkBackendHealth = async () => {
    setHealthStatus((prev) => ({ ...prev, backend: 'checking' }));
    const startTime = Date.now();
    try {
      const res = await fetch('/api/menu', { cache: 'no-store' });
      const latency = Date.now() - startTime;
      if (res.ok) {
        setHealthStatus({
          backend: 'online',
          latencyMs: latency,
          dbStatus: 'Connected & Healthy',
          checkedAt: new Date().toLocaleTimeString(),
        });
      } else {
        setHealthStatus({
          backend: 'offline',
          latencyMs: latency,
          dbStatus: `HTTP ${res.status}`,
          checkedAt: new Date().toLocaleTimeString(),
        });
      }
    } catch {
      setHealthStatus({
        backend: 'offline',
        latencyMs: Date.now() - startTime,
        dbStatus: 'Unreachable',
        checkedAt: new Date().toLocaleTimeString(),
      });
    }
  };

  const loadStorage = () => {
    if (typeof window === 'undefined') return;
    const items: { key: string; value: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('foodline') || key.includes('cart') || key.includes('slot') || key.includes('sb-'))) {
        items.push({
          key,
          value: localStorage.getItem(key) || '',
        });
      }
    }
    setStorageItems(items);
  };

  const clearStorage = () => {
    if (typeof window === 'undefined') return;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('foodline') || key.includes('cart') || key.includes('slot'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    loadStorage();
  };

  useEffect(() => {
    checkBackendHealth();
    loadStorage();
  }, []);

  const renderIcon = (name: string) => {
    const props = { className: 'w-5 h-5' };
    switch (name) {
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'CreditCard':
        return <CreditCard {...props} />;
      case 'Lock':
        return <Lock {...props} />;
      case 'SearchX':
        return <SearchX {...props} />;
      case 'Clock':
        return <Clock {...props} />;
      case 'Users':
        return <Users {...props} />;
      case 'FileX':
        return <FileX {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'ServerCrash':
        return <ServerCrash {...props} />;
      case 'WifiOff':
        return <WifiOff {...props} />;
      case 'Coffee':
        return <Coffee {...props} />;
      case 'Hourglass':
        return <Hourglass {...props} />;
      default:
        return <AlertTriangle {...props} />;
    }
  };

  const appRoutes = [
    { label: 'Student Home', path: '/', icon: Home, desc: 'Landing & Break Stepper' },
    { label: 'Campus Menu', path: '/menu', icon: UtensilsCrossed, desc: '44 Dishes, 8 Categories' },
    { label: 'Cart Tray & Checkout', path: '/checkout', icon: CreditCard, desc: 'Slot Picker & UPI' },
    { label: 'Order History', path: '/orders', icon: Clock, desc: 'Active Pickup Tokens' },
    { label: 'Kitchen Tablet (KDS)', path: '/kds', icon: Activity, desc: 'Cooking Queue & 1-Tap Ready' },
    { label: 'Counter TV Display', path: '/display', icon: Compass, desc: 'Pickup Chime & Token Wall' },
    { label: 'GMV Admin Dashboard', path: '/admin', icon: Server, desc: 'Analytics & DPDP Compliance' },
    { label: 'Student / Staff Login', path: '/login', icon: Lock, desc: 'PRN & Password Auth' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-canvas,#07070B)] text-[#F5F5F7] p-4 sm:p-6 lg:p-10">
      {/* Top Banner Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Bug className="w-3.5 h-3.5" />
                DEVELOPER DIAGNOSTICS & TESTING HUB
              </span>
              <span className="text-xs text-zinc-500 font-mono">v1.0.0 Production Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              FoodLine Campus Debugging & Error Suite
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Verify system health, preview all HTTP status code pages, and test error boundaries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={checkBackendHealth}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Recheck Health
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-orange,#FF6B2C)] hover:brightness-110 text-white transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              Return to App
            </Link>
          </div>
        </div>

        {/* SECTION 1: System Health Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0E0E15]/90 border border-white/10 backdrop-blur-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-400">Backend API</span>
              <Server className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex items-center gap-2">
              {healthStatus.backend === 'checking' && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              )}
              {healthStatus.backend === 'online' && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              )}
              {healthStatus.backend === 'offline' && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
              )}
              <span className="font-bold text-lg text-white capitalize">
                {healthStatus.backend}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Port :4000 • Checked: {healthStatus.checkedAt}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E0E15]/90 border border-white/10 backdrop-blur-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-400">Latency Meter</span>
              <Activity className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-2xl text-emerald-400">
                {healthStatus.latencyMs}
              </span>
              <span className="text-xs text-zinc-400 font-mono">ms</span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">Sub-50ms target for 30s pickup SLA</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E0E15]/90 border border-white/10 backdrop-blur-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-400">Supabase DB</span>
              <Database className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-sm text-white">
                {healthStatus.dbStatus}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">PostgreSQL Cloud Pool</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E0E15]/90 border border-white/10 backdrop-blur-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-zinc-400">Crash Boundary</span>
              <Cpu className="w-4 h-4 text-zinc-500" />
            </div>
            <button
              onClick={() => setShouldCrash(true)}
              className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Simulate React Error
            </button>
            <p className="text-[11px] text-zinc-500 font-mono">Tests error.tsx recovery boundary</p>
          </div>
        </div>

        {/* SECTION 2: HTTP Status Code Gallery (1-Click Test & Preview) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-400" />
                HTTP Status Error Suite (All Pages & Dynamic Routes)
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Every HTTP code includes custom campus-canteen analogies, technical descriptions, and recovery flows.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {Object.keys(HTTP_ERRORS_CATALOG).length} Registered Error Pages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(HTTP_ERRORS_CATALOG).map((err) => (
              <div
                key={err.code}
                className="p-5 rounded-2xl bg-[#0E0E15]/80 border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${err.badgeColor}`}
                    >
                      {renderIcon(err.iconName)}
                      HTTP {err.code}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {err.statusName}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-orange-400 transition-colors">
                      {err.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {err.subtitle}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-300 italic line-clamp-2">
                    &ldquo;{err.canteenMetaphor}&rdquo;
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => setPreviewError(err)}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview Modal
                  </button>

                  <Link
                    href={`/${err.code}`}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 transition-colors flex items-center justify-center gap-1"
                    title={`Open direct route /${err.code}`}
                  >
                    <span>/{err.code}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <Link
                    href={`/error/${err.code}`}
                    className="py-1.5 px-2.5 rounded-lg text-xs font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    title={`Open dynamic route /error/${err.code}`}
                  >
                    API
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Storage & Cache State Inspector */}
        <div className="p-6 rounded-3xl bg-[#0E0E15]/80 border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-orange-400" />
                Browser LocalStorage & Cart State Inspector
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Inspect active cached client session tokens, cart tray contents, and selected break slot keys.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadStorage}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Keys
              </button>
              <button
                onClick={clearStorage}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear FoodLine Cache
              </button>
            </div>
          </div>

          {storageItems.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-white/10 rounded-2xl text-xs text-zinc-500">
              No active FoodLine localStorage keys found. Add items to cart on the menu to inspect state!
            </div>
          ) : (
            <div className="space-y-2">
              {storageItems.map((item) => (
                <div
                  key={item.key}
                  className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-orange-400 font-bold">{item.key}:</span>
                    <span className="text-zinc-400 truncate max-w-md">{item.value}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.value);
                      setCopiedKey(item.key);
                      setTimeout(() => setCopiedKey(null), 1500);
                    }}
                    className="text-[11px] text-zinc-500 hover:text-white shrink-0 cursor-pointer"
                  >
                    {copiedKey === item.key ? '✓ Copied' : 'Copy Value'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 4: Quick App Route Directory */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-400" />
            Quick App Page Launcher & Navigation Matrix
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {appRoutes.map((rt) => {
              const IconComp = rt.icon;
              return (
                <Link
                  key={rt.path}
                  href={rt.path}
                  className="p-4 rounded-2xl bg-[#0E0E15]/60 hover:bg-[#0E0E15] border border-white/5 hover:border-white/20 transition-all duration-200 group"
                >
                  <div className="p-2 rounded-xl bg-white/[0.04] w-fit text-zinc-400 group-hover:text-orange-400 transition-colors mb-2">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors truncate">
                    {rt.label}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{rt.desc}</p>
                  <span className="text-[10px] text-zinc-600 font-mono mt-1 block">
                    {rt.path}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Preview Modal for Error Pages */}
      {previewError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setPreviewError(null)}
              className="absolute -top-3 -right-3 z-50 p-2 rounded-full bg-zinc-800 border border-white/20 text-white hover:bg-zinc-700 shadow-xl cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <ErrorView error={previewError} />
          </div>
        </div>
      )}
    </div>
  );
}
