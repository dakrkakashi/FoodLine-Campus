'use client';

import React, { useEffect, useState } from 'react';

export function DeferredMount({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;

    const release = () => {
      if (!cancelled) requestAnimationFrame(() => setReady(true));
    };

    const win = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === 'function') {
      idleId = win.requestIdleCallback(release, { timeout: 2000 });
    } else {
      idleId = window.setTimeout(release, 400);
    }

    return () => {
      cancelled = true;
      if (typeof win.requestIdleCallback === 'function' && idleId !== undefined) {
        win.cancelIdleCallback?.(idleId);
      } else if (idleId !== undefined) {
        window.clearTimeout(idleId);
      }
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}