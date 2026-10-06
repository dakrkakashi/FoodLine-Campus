/**
 * Design system tokens & Tailwind CSS class compositions for PickupQrTrackerCard.
 * Adheres strictly to FoodLine Campus UI/UX Design System and WCAG 2.2 accessibility standards.
 */

export const trackerStyles = {
  container:
    'relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl p-5 sm:p-6 shadow-2xl transition-all duration-300 text-white',
  
  header: 'flex items-center justify-between gap-4 border-b border-white/10 pb-4',
  
  tokenBadge:
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-orange-500/15 text-orange-400 border border-orange-500/30',

  canteenInfo: 'flex flex-col gap-0.5',
  canteenTitle: 'text-sm font-semibold tracking-wide text-neutral-200',
  slotSubtitle: 'text-xs text-neutral-400 flex items-center gap-1',

  statusBanner: {
    base: 'relative rounded-2xl p-4 my-4 flex items-center justify-between gap-3 overflow-hidden border',
    PENDING_PAYMENT: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    PAY_AT_COUNTER: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    AWAITING_VERIFICATION: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    CONFIRMED: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    PREPARING: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
    READY: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-500/30',
    COLLECTED: 'bg-neutral-800/60 border-neutral-700/50 text-neutral-300',
    CANCELLED: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
    REFUNDED: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
  },

  otpSection:
    'flex flex-col items-center justify-center p-4 rounded-2xl bg-neutral-900/90 border border-white/10 my-4 text-center select-all',
  otpLabel: 'text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-1',
  otpCode:
    'font-mono text-3xl sm:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400',

  qrContainer:
    'flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner border border-neutral-300 my-4 transition-transform hover:scale-[1.01]',
  qrCaption: 'text-[11px] text-neutral-500 mt-2 text-center font-medium',

  stepperTrack: 'relative flex items-center justify-between my-5 px-1',
  stepperLineBase: 'absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-neutral-800 -z-0 rounded-full',
  stepperLineFill: 'absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-emerald-500 -z-0 rounded-full transition-all duration-500',
  
  stepNode: {
    base: 'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold transition-all duration-300',
    completed: 'bg-emerald-500 border-emerald-400 text-neutral-950',
    active: 'bg-orange-500 border-orange-400 text-white ring-4 ring-orange-500/20 scale-110',
    upcoming: 'bg-neutral-900 border-neutral-700 text-neutral-500',
  },

  actionButton:
    'min-h-[48px] px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500/50',
  actionPrimary: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-neutral-950 font-semibold shadow-lg shadow-orange-500/20',
  actionSecondary: 'bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-200',

  skeletonPulse: 'animate-pulse bg-neutral-800/60 rounded-xl',
};

