'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  iconOnly?: boolean;
}

export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  className = '',
  iconOnly = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy error gracefully
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : `Copy ${text}`}
      title={copied ? copiedLabel : label}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
        copied
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          : 'bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 text-(--text-secondary) hover:text-(--text-primary) border border-(--border-glass)'
      } ${className}`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 shrink-0" />
      )}
      {!iconOnly && <span>{copied ? copiedLabel : label}</span>}
    </button>
  );
}
