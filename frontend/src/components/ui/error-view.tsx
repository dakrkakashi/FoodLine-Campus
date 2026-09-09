'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
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
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Home,
  ArrowLeft,
  Terminal,
  Copy,
  Check,
  Utensils,
  Sparkles,
} from 'lucide-react';
import { ErrorMetadata, getErrorMetadata } from '@/lib/errors-catalog';

interface ErrorViewProps {
  error?: ErrorMetadata;
  code?: number | string;
  customTitle?: string;
  customSubtitle?: string;
  customMessage?: string;
  digest?: string;
  onRetry?: () => void;
  showDiagnostics?: boolean;
}

export function ErrorView({
  error: errorProp,
  code = 500,
  customTitle,
  customSubtitle,
  customMessage,
  digest,
  onRetry,
  showDiagnostics = true,
}: ErrorViewProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const errorData = errorProp || getErrorMetadata(code);

  const renderIcon = (name: string) => {
    const iconProps = { className: 'w-10 h-10' };
    switch (name) {
      case 'ShieldAlert':
        return <ShieldAlert {...iconProps} />;
      case 'CreditCard':
        return <CreditCard {...iconProps} />;
      case 'Lock':
        return <Lock {...iconProps} />;
      case 'SearchX':
        return <SearchX {...iconProps} />;
      case 'Clock':
        return <Clock {...iconProps} />;
      case 'Users':
        return <Users {...iconProps} />;
      case 'FileX':
        return <FileX {...iconProps} />;
      case 'Flame':
        return <Flame {...iconProps} />;
      case 'ServerCrash':
        return <ServerCrash {...iconProps} />;
      case 'WifiOff':
        return <WifiOff {...iconProps} />;
      case 'Coffee':
        return <Coffee {...iconProps} />;
      case 'Hourglass':
        return <Hourglass {...iconProps} />;
      default:
        return <AlertTriangle {...iconProps} />;
    }
  };

  const handleAction = (actionType?: string, href?: string) => {
    if (actionType === 'retry') {
      if (onRetry) {
        onRetry();
      } else {
        window.location.reload();
      }
      return;
    }
    if (actionType === 'back') {
      router.back();
      return;
    }
    if (actionType === 'home') {
      router.push('/');
      return;
    }
    if (href) {
      router.push(href);
    }
  };

  const copyDiagnostics = () => {
    const diagnosticPayload = JSON.stringify(
      {
        errorCode: errorData.code,
        statusName: errorData.statusName,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        digest: digest || 'N/A',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      },
      null,
      2
    );

    navigator.clipboard.writeText(diagnosticPayload).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Dynamic Ambient Background Glow */}
      <div
        className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 sm:w-125 sm:h-125 bg-linear-to-br ${errorData.glowColor} rounded-full blur-3xl pointer-events-none opacity-40 animate-pulse`}
      />

      <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-300">
        {/* Top Status Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[var(--bg-card-hover)] border border-[var(--border-glass)] text-[var(--text-primary)] shadow-inner">
              {renderIcon(errorData.iconName)}
            </div>
            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${errorData.badgeColor}`}
              >
                HTTP {errorData.code} • {errorData.statusName}
              </span>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                Sanjivani Cafe @7 • Campus Express System
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg bg-[var(--bg-card-hover)] border border-[var(--border-glass)] hover:border-orange-500/30 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>

        {/* Main Error Title & Description */}
        <div className="space-y-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {customTitle || errorData.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {customSubtitle || errorData.subtitle}
          </p>

          {/* Campus Metaphor Alert Banner */}
          <div className="mt-4 p-4 rounded-2xl bg-[var(--bg-card-hover)]/70 border border-[var(--border-glass)] flex items-start gap-3">
            <Utensils className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-accent-orange uppercase tracking-wider">
                Kitchen Canteen Log
              </span>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic">
                &ldquo;{customMessage || errorData.canteenMetaphor}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 mb-6">
          {errorData.actions.map((act, index) => {
            const isPrimary = act.variant === 'primary' || index === 0;
            const isOutline = act.variant === 'outline';

            if (act.onClickAction) {
              return (
                <button
                  key={index}
                  onClick={() => handleAction(act.onClickAction)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isPrimary
                      ? 'bg-linear-to-r from-[#FF6B2C] to-[#FF8F3D] text-white hover:brightness-110 shadow-lg shadow-orange-500/20 active:scale-95'
                      : isOutline
                      ? 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] hover:border-orange-500/30 active:scale-95'
                      : 'bg-[var(--bg-card-hover)] text-[var(--text-primary)] hover:bg-[var(--bg-card-active)] border border-[var(--border-glass)] active:scale-95'
                  }`}
                >
                  {act.onClickAction === 'retry' && <RefreshCw className="w-4 h-4" />}
                  {act.onClickAction === 'back' && <ArrowLeft className="w-4 h-4" />}
                  {act.onClickAction === 'home' && <Home className="w-4 h-4" />}
                  {act.label}
                </button>
              );
            }

            return (
              <Link
                key={index}
                href={act.href || '/'}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isPrimary
                    ? 'bg-linear-to-r from-[#FF6B2C] to-[#FF8F3D] text-white hover:brightness-110 shadow-lg shadow-orange-500/20 active:scale-95'
                    : isOutline
                    ? 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] hover:border-orange-500/30 active:scale-95'
                    : 'bg-[var(--bg-card-hover)] text-[var(--text-primary)] hover:bg-[var(--bg-card-active)] border border-[var(--border-glass)] active:scale-95'
                }`}
              >
                {act.label}
              </Link>
            );
          })}

          <button
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-glass)] hover:border-orange-500/30 transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Technical Diagnostics Accordion */}
        {showDiagnostics && (
          <div className="border-t border-[var(--border-glass)] pt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] py-1 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 font-mono">
                <Terminal className="w-3.5 h-3.5 text-accent-orange" />
                Technical Error Diagnostics & Stack Info
              </span>
              {showDetails ? (
                <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
              )}
            </button>

            {showDetails && (
              <div className="mt-3 p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-glass)] text-xs font-mono space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-2">
                  <span className="text-[var(--text-secondary)]">Diagnostic Details</span>
                  <button
                    onClick={copyDiagnostics}
                    className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Diagnostics</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[var(--text-secondary)]">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase">
                      HTTP Status Code
                    </span>
                    <span className="text-[var(--text-primary)]">{errorData.code} ({errorData.statusName})</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase">
                      Timestamp
                    </span>
                    <span className="text-[var(--text-primary)]">{new Date().toLocaleTimeString()}</span>
                  </div>
                  {digest && (
                    <div className="sm:col-span-2">
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase">
                        Error Digest Hash
                      </span>
                      <span className="text-amber-500 break-all">{digest}</span>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase">
                      Technical Spec
                    </span>
                    <span className="text-[var(--text-secondary)] leading-normal">
                      {errorData.technicalDescription}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase">
                      Recommended Fix
                    </span>
                    <span className="text-emerald-500 leading-normal font-medium">
                      {errorData.recommendedAction}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[var(--border-glass)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span>FoodLine Campus Engine • Sanjivani Univ</span>
                  <Link href="/debug" className="text-orange-500 hover:underline font-medium">
                    Open Debug Hub →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
