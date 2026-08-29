'use client';

import { useEffect, useState, useCallback } from 'react';

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestLock = useCallback(async () => {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) return;

    try {
      const sentinel = await navigator.wakeLock.request('screen');
      setIsLocked(true);

      sentinel.addEventListener('release', () => {
        setIsLocked(false);
      });

      return sentinel;
    } catch (err: any) {
      console.warn('Screen WakeLock error:', err.message);
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    let currentSentinel: any = null;

    requestLock().then((sentinel) => {
      currentSentinel = sentinel;
    });

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        currentSentinel = await requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (currentSentinel && typeof currentSentinel.release === 'function') {
        currentSentinel.release().catch(() => {});
      }
    };
  }, [requestLock]);

  return { isLocked, isSupported, requestLock };
}
