import React from 'react';

export function PaymentBadge({ isCod }: { isCod?: boolean }) {
  if (isCod) {
    return (
      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-mono uppercase tracking-wider shadow-sm">
        <span>💵</span>
        <span>COD</span>
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono uppercase tracking-wider shadow-sm">
      <span>⚡</span>
      <span>PAID</span>
    </span>
  );
}
