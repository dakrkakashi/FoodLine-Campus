/**
 * 📺 FoodLine Counter Display Utilities
 * Helper functions for Smart Dynamic Counter Routing, Time formatting, and Slot countdowns.
 */

const BEVERAGE_DESSERT_KEYWORDS = [
  'tea',
  'chai',
  'coffee',
  'shake',
  'chocolate',
  'brownie',
  'gulab jamun',
  'ice cream',
  'ice-cream',
  'water',
  'juice',
  'beverage',
  'dessert',
];

/**
 * 🏷️ Smart Dynamic Counter Routing
 * - Returns 2 (Beverages & Express Desserts) if order contains ONLY drinks/desserts
 * - Returns 1 (Hot Kitchen & Snacks) if order contains ANY cooked food
 */
export function getCounterForOrder(
  items?: { item_name?: string; name?: string; category?: string }[],
  isCod?: boolean
): 1 | 2 {
  // COD always routes to Counter 1 for cash collection at counter
  if (isCod) return 1;

  if (!items || items.length === 0) return 1;

  const allBeverageOrDessert = items.every((item) => {
    const name = (item.item_name || item.name || '').toLowerCase();
    const cat = (item.category || '').toLowerCase();
    return (
      BEVERAGE_DESSERT_KEYWORDS.some((kw) => name.includes(kw)) ||
      cat.includes('beverage') ||
      cat.includes('dessert')
    );
  });

  return allBeverageOrDessert ? 2 : 1;
}

export function getCounterLabel(counter: 1 | 2): { title: string; subtitle: string } {
  if (counter === 2) {
    return {
      title: 'Counter 2',
      subtitle: 'Beverages & Express Desserts',
    };
  }
  return {
    title: 'Counter 1',
    subtitle: 'Hot Kitchen & Snacks',
  };
}

/**
 * ⏱️ Calculate remaining prep minutes from order creation timestamp
 */
export function calculateRemainingPrepTime(
  createdAt?: string,
  prepTimeMins: number = 5
): { mins: number; formatted: string } {
  if (!createdAt) return { mins: prepTimeMins, formatted: `~${prepTimeMins}m` };

  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  const elapsedMins = Math.floor((now - createdTime) / 60000);
  const remaining = Math.max(1, prepTimeMins - elapsedMins);

  return {
    mins: remaining,
    formatted: `~${remaining}m`,
  };
}

/**
 * 🕒 Format live digital clock
 */
export function formatDigitalClock(date: Date): { timeString: string; ampm: string; dateString: string } {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateString = `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;

  return {
    timeString: `${displayHours}:${minutes}:${seconds}`,
    ampm,
    dateString,
  };
}

/**
 * ⏳ Calculate Campus Break Slot Countdown
 */
interface CampusBreakSlot {
  label: string;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
}

const CAMPUS_BREAKS: CampusBreakSlot[] = [
  { label: 'Morning Tea Break', startHour: 10, startMin: 0, endHour: 10, endMin: 15 },
  { label: 'Lunch Rush Break', startHour: 11, startMin: 50, endHour: 12, endMin: 15 },
  { label: 'Afternoon Tea Break', startHour: 13, startMin: 15, endHour: 13, endMin: 30 },
  { label: 'Evening Snack Break', startHour: 15, startMin: 45, endHour: 16, endMin: 15 },
  { label: 'Post-Lecture Grab', startHour: 17, startMin: 0, endHour: 17, endMin: 30 },
];

export function getActiveCampusBreakStatus(now: Date = new Date()): {
  label: string;
  countdown: string;
  isActive: boolean;
  type: 'active' | 'upcoming' | 'closed';
} {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();

  for (const b of CAMPUS_BREAKS) {
    const breakStart = b.startHour * 60 + b.startMin;
    const breakEnd = b.endHour * 60 + b.endMin;

    if (currentMinutes >= breakStart && currentMinutes < breakEnd) {
      const remainingSecs = (breakEnd - currentMinutes) * 60 - currentSeconds;
      const mins = Math.floor(remainingSecs / 60);
      const secs = remainingSecs % 60;
      return {
        label: b.label,
        countdown: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
        isActive: true,
        type: 'active',
      };
    }
  }

  // Find next upcoming break
  for (const b of CAMPUS_BREAKS) {
    const breakStart = b.startHour * 60 + b.startMin;
    if (currentMinutes < breakStart) {
      const diffSecs = (breakStart - currentMinutes) * 60 - currentSeconds;
      const mins = Math.floor(diffSecs / 60);
      const secs = diffSecs % 60;
      return {
        label: `Next: ${b.label}`,
        countdown: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
        isActive: false,
        type: 'upcoming',
      };
    }
  }

  return {
    label: 'Campus Kitchen Standard Hours',
    countdown: 'Open',
    isActive: false,
    type: 'closed',
  };
}
