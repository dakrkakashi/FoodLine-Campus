/**
 * 🍔 FoodLine Campus — HTTP Error Codes & Canteen Metaphors Catalog
 * Single source of truth for all application error states, diagnostics, and recovery paths.
 */

export interface ErrorAction {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onClickAction?: 'retry' | 'back' | 'login' | 'cart' | 'home';
}

export interface ErrorMetadata {
  code: number;
  statusName: string;
  title: string;
  subtitle: string;
  canteenMetaphor: string;
  technicalDescription: string;
  recommendedAction: string;
  badgeColor: string; // Tailwind color class or hex
  glowColor: string;
  actions: ErrorAction[];
  iconName:
    | 'AlertTriangle'
    | 'ShieldAlert'
    | 'CreditCard'
    | 'Lock'
    | 'SearchX'
    | 'Clock'
    | 'Users'
    | 'FileX'
    | 'Flame'
    | 'ServerCrash'
    | 'WifiOff'
    | 'Coffee'
    | 'Hourglass';
}

export const HTTP_ERRORS_CATALOG: Record<number, ErrorMetadata> = {
  400: {
    code: 400,
    statusName: 'BAD_REQUEST',
    title: 'Order Tray Malformed',
    subtitle: 'Something was wrong with the submitted order details.',
    canteenMetaphor: 'The kitchen slip got crumpled in transit! Some order parameters or quantities were incomplete or corrupted.',
    technicalDescription: 'HTTP 400 Bad Request — The server could not understand the request due to invalid syntax, missing fields, or malformed JSON body.',
    recommendedAction: 'Verify your cart items and ensure your phone number and student credentials are valid before submitting again.',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    glowColor: 'from-amber-500/20 to-orange-500/10',
    iconName: 'AlertTriangle',
    actions: [
      { label: 'Check Cart', href: '/checkout', variant: 'primary' },
      { label: 'Back to Menu', href: '/menu', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  401: {
    code: 401,
    statusName: 'UNAUTHORIZED',
    title: 'Student Session Expired',
    subtitle: 'You need to be authenticated to access this feature.',
    canteenMetaphor: 'Your student ID card scan expired at the counter turnstile! Please log in again to verify your university credentials.',
    technicalDescription: 'HTTP 401 Unauthorized — The request lacks valid authentication credentials. Authorization header or Supabase session token is missing or expired.',
    recommendedAction: 'Log in with your registered phone number or university email to renew your session.',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    glowColor: 'from-sky-500/20 to-blue-500/10',
    iconName: 'Lock',
    actions: [
      { label: 'Log In Now', href: '/login', variant: 'primary' },
      { label: 'Sign Up with PRN', href: '/login', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  402: {
    code: 402,
    statusName: 'PAYMENT_REQUIRED',
    title: 'UPI Payment Pending',
    subtitle: 'Order hold requires completed UPI transaction or 12-digit UTR verification.',
    canteenMetaphor: 'The chef has reserved your fresh plate, but the payment confirmation hasn’t chimed on the counter soundbox yet!',
    technicalDescription: 'HTTP 402 Payment Required — Order cannot transition to CONFIRMED status without a verified UPI transaction or valid 12-digit Bank Reference (UTR) number.',
    recommendedAction: 'Scan the Cafe @7 dynamic UPI QR code or submit your 12-digit Bank UTR reference to release kitchen preparation.',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    glowColor: 'from-emerald-500/20 to-teal-500/10',
    iconName: 'CreditCard',
    actions: [
      { label: 'Submit Bank UTR', href: '/checkout', variant: 'primary' },
      { label: 'Track Orders', href: '/orders', variant: 'secondary' },
      { label: 'Back to Menu', href: '/menu', variant: 'outline' },
    ],
  },
  403: {
    code: 403,
    statusName: 'FORBIDDEN',
    title: 'Kitchen & Staff Only Area',
    subtitle: 'You do not have permission to view or manage this administrative zone.',
    canteenMetaphor: 'Staff Only! The kitchen preparation station and manager terminal require authorized cafeteria staff credentials.',
    technicalDescription: 'HTTP 403 Forbidden — The server understood the request, but refuses to authorize it. Missing STAFF or ADMIN role.',
    recommendedAction: 'If you are a cafeteria manager or counter attendant, sign in with your staff account. Otherwise, return to the student menu.',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    glowColor: 'from-rose-500/20 to-red-500/10',
    iconName: 'ShieldAlert',
    actions: [
      { label: 'Staff Login', href: '/login', variant: 'primary' },
      { label: 'Student Menu', href: '/menu', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  404: {
    code: 404,
    statusName: 'NOT_FOUND',
    title: 'Plate Empty / Dish Not Found',
    subtitle: 'The page, order token, or menu dish you were looking for doesn’t exist.',
    canteenMetaphor: 'Looks like someone already grabbed the last plate, or this dish isn’t on today’s Cafe @7 blackboard!',
    technicalDescription: 'HTTP 404 Not Found — The server cannot find the requested resource. The URL path may be invalid or the order token has expired.',
    recommendedAction: 'Check the URL spelling or browse today’s 44 live items on the active campus menu.',
    badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    glowColor: 'from-orange-500/20 to-amber-500/10',
    iconName: 'SearchX',
    actions: [
      { label: 'Explore Menu', href: '/menu', variant: 'primary' },
      { label: 'Track Active Orders', href: '/orders', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  408: {
    code: 408,
    statusName: 'REQUEST_TIMEOUT',
    title: 'Campus Wi-Fi Timed Out',
    subtitle: 'The server waited longer than allowed for your connection to respond.',
    canteenMetaphor: 'Campus Wi-Fi dipped between academic blocks! The kitchen timed out waiting for your payment signal.',
    technicalDescription: 'HTTP 408 Request Timeout — The client did not produce a request within the server timeout window. Network latency or packet loss detected.',
    recommendedAction: 'Switch to mobile data or reconnect to university Wi-Fi, then refresh to retry.',
    badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    glowColor: 'from-yellow-500/20 to-amber-500/10',
    iconName: 'Clock',
    actions: [
      { label: 'Retry Connection', onClickAction: 'retry', variant: 'primary' },
      { label: 'View Saved Cart', href: '/checkout', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  409: {
    code: 409,
    statusName: 'CONFLICT',
    title: 'Break Slot 60/60 Cap Reached',
    subtitle: 'This break window has reached maximum kitchen capacity.',
    canteenMetaphor: 'The 60-order kitchen throttling cap is locked! To guarantee 30-second express pickups with zero waiting lines, this break slot cannot accept more orders.',
    technicalDescription: 'HTTP 409 Conflict — Slot capacity limit exceeded. Current booked count equals or exceeds max_capacity (60). Throttling engine blocked reservation.',
    recommendedAction: 'Select the next available break window or pre-order for the afternoon refreshment break.',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    glowColor: 'from-purple-500/20 to-pink-500/10',
    iconName: 'Users',
    actions: [
      { label: 'Pick Another Slot', href: '/checkout', variant: 'primary' },
      { label: 'Browse Menu', href: '/menu', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  422: {
    code: 422,
    statusName: 'UNPROCESSABLE_ENTITY',
    title: 'Invalid Order Credentials',
    subtitle: 'The submitted form data was well-formed but failed validation rules.',
    canteenMetaphor: 'The cashier couldn’t read the slip! The phone number was not 10 digits, or the UPI UTR code didn’t match bank formats.',
    technicalDescription: 'HTTP 422 Unprocessable Entity — Validation failure on request fields (e.g., studentPhone, utrNumber regex, or missing mandatory email).',
    recommendedAction: 'Double-check that your phone number has exactly 10 digits and your UTR reference has 12 digits.',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    glowColor: 'from-indigo-500/20 to-purple-500/10',
    iconName: 'FileX',
    actions: [
      { label: 'Fix Details', href: '/checkout', variant: 'primary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  429: {
    code: 429,
    statusName: 'TOO_MANY_REQUESTS',
    title: 'OTP Rate Limit Cooldown',
    subtitle: 'Too many rapid verification attempts detected.',
    canteenMetaphor: 'Hold on! You tapped verify faster than chai boils! Please wait a moment before trying again.',
    technicalDescription: 'HTTP 429 Too Many Requests — Anti-abuse rate limiting triggered. Request threshold exceeded within the sliding rate window.',
    recommendedAction: 'Wait 30 to 60 seconds before requesting another pickup OTP or submitting payment verification.',
    badgeColor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    glowColor: 'from-pink-500/20 to-rose-500/10',
    iconName: 'Flame',
    actions: [
      { label: 'Wait & Retry', onClickAction: 'retry', variant: 'primary' },
      { label: 'View Orders', href: '/orders', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  500: {
    code: 500,
    statusName: 'INTERNAL_SERVER_ERROR',
    title: 'Kitchen Engine Exception',
    subtitle: 'An unexpected internal error occurred on our server.',
    canteenMetaphor: 'Steam overload in the server kitchen! Our backend engine hit an unexpected hiccup processing this request.',
    technicalDescription: 'HTTP 500 Internal Server Error — The server encountered an unexpected condition that prevented it from fulfilling the request.',
    recommendedAction: 'Our technical team has been notified. Please try refreshing in a few seconds or contact the Cafe @7 counter.',
    badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    glowColor: 'from-red-500/20 to-rose-500/10',
    iconName: 'ServerCrash',
    actions: [
      { label: 'Try Again', onClickAction: 'retry', variant: 'primary' },
      { label: 'Back to Menu', href: '/menu', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  502: {
    code: 502,
    statusName: 'BAD_GATEWAY',
    title: 'Gateway Connection Dropped',
    subtitle: 'The edge server received an invalid response from the backend service.',
    canteenMetaphor: 'The digital ordering kiosk lost touch with the kitchen display tablet. The link is reconnecting automatically.',
    technicalDescription: 'HTTP 502 Bad Gateway — The reverse proxy / edge server received an invalid response or connection drop from the upstream Express API.',
    recommendedAction: 'Check if the backend engine is running on port 4000, then refresh.',
    badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    glowColor: 'from-orange-500/20 to-red-500/10',
    iconName: 'WifiOff',
    actions: [
      { label: 'Reconnect', onClickAction: 'retry', variant: 'primary' },
      { label: 'System Diagnostics', href: '/debug', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  503: {
    code: 503,
    statusName: 'SERVICE_UNAVAILABLE',
    title: 'Cafeteria Closed / Shift Prep',
    subtitle: 'Cafe @7 is currently between operational meal service windows.',
    canteenMetaphor: 'The kitchen shutters are down for morning prep or afternoon sanitization! Hot express meals will resume for the next campus break.',
    technicalDescription: 'HTTP 503 Service Unavailable — The server is currently unable to handle the request due to scheduled maintenance or off-hours closure.',
    recommendedAction: 'Check the campus break schedule to see when the next pre-ordering window opens.',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    glowColor: 'from-cyan-500/20 to-blue-500/10',
    iconName: 'Coffee',
    actions: [
      { label: 'View Break Schedule', href: '/menu', variant: 'primary' },
      { label: 'System Diagnostics', href: '/debug', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
  504: {
    code: 504,
    statusName: 'GATEWAY_TIMEOUT',
    title: 'Database Response Timeout',
    subtitle: 'The upstream database took too long to return menu or slot capacity records.',
    canteenMetaphor: 'The digital ledger query took longer than expected during peak lunch rush! The database is catching up.',
    technicalDescription: 'HTTP 504 Gateway Timeout — Upstream Supabase PostgreSQL latency exceeded gateway threshold (>10,000ms).',
    recommendedAction: 'Please retry in a moment; cached menu items will reload automatically.',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    glowColor: 'from-amber-500/20 to-orange-500/10',
    iconName: 'Hourglass',
    actions: [
      { label: 'Retry Query', onClickAction: 'retry', variant: 'primary' },
      { label: 'View Menu Cache', href: '/menu', variant: 'secondary' },
      { label: 'Return Home', href: '/', variant: 'outline' },
    ],
  },
};

/**
 * Helper to resolve an error metadata object by HTTP code or fallback
 */
export function getErrorMetadata(code: number | string): ErrorMetadata {
  const numericCode = Number(code);
  if (HTTP_ERRORS_CATALOG[numericCode]) {
    return HTTP_ERRORS_CATALOG[numericCode];
  }

  // Generic fallback for custom / unknown codes
  return {
    code: isNaN(numericCode) ? 500 : numericCode,
    statusName: 'UNEXPECTED_ERROR',
    title: `HTTP ${code} Error`,
    subtitle: 'An unexpected application condition occurred.',
    canteenMetaphor: 'The digital ordering screen encountered an unlisted kitchen code! Our team has logged this occurrence.',
    technicalDescription: `HTTP ${code} — Status code received without specific custom handling.`,
    recommendedAction: 'Navigate back to the main campus menu or return home.',
    badgeColor: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
    glowColor: 'from-zinc-500/20 to-zinc-700/10',
    iconName: 'AlertTriangle',
    actions: [
      { label: 'Back to Menu', href: '/menu', variant: 'primary' },
      { label: 'Return Home', href: '/', variant: 'secondary' },
    ],
  };
}
