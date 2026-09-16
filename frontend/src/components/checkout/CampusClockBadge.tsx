'use client';

import React, { useState, useEffect } from 'react';
import { getCampusTimeIST } from '@/lib/campus-time';

export function CampusClockBadge() {
  const [clock, setClock] = useState(() => getCampusTimeIST());

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(getCampusTimeIST());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span suppressHydrationWarning className="font-mono text-accent-orange font-black">
      {clock.displayWithSeconds || clock.displayTime12h} IST
    </span>
  );
}
