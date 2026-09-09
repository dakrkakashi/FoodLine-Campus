/**
 * Campus Time Utilities (IST: Asia/Kolkata)
 * Enforces real-time campus clock synchronization, auto-slot closures when pickup time passes,
 * and next-day pre-order scheduling for Sanjivani University (Cafe @7).
 */

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const str = timeStr.trim().toUpperCase();
  const isPM = str.includes('PM');
  const isAM = str.includes('AM');
  const cleaned = str.replace(/[AP]M/, '').trim();
  const parts = cleaned.split(':');
  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  if (isPM && hours < 12) hours += 12;
  else if (isAM && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function getCampusTimeIST(): {
  hours: number;
  minutes: number;
  seconds: number;
  totalMinutes: number;
  displayTime12h: string;
  displayWithSeconds: string;
} {
  const now = new Date();
  const istFormatter24 = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });
  const parts = istFormatter24.formatToParts(now);
  const hours = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
  const minutes = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
  const seconds = parseInt(parts.find((p) => p.type === 'second')?.value || '0', 10);
  const totalMinutes = hours * 60 + minutes;

  const istFormatter12 = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const istFormatter12WithSec = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return {
    hours,
    minutes,
    seconds,
    totalMinutes,
    displayTime12h: istFormatter12.format(now),
    displayWithSeconds: istFormatter12WithSec.format(now),
  };
}

export function isSlotPassedForDay(slotStartTime: string, day: 'TODAY' | 'TOMORROW' = 'TODAY'): boolean {
  if (day === 'TOMORROW') return false;
  const { totalMinutes } = getCampusTimeIST();
  const startMinutes = parseTimeToMinutes(slotStartTime);
  return totalMinutes >= startMinutes;
}
