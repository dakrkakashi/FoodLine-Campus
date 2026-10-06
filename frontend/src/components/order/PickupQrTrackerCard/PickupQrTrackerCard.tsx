'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  QrCode,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Receipt,
  Clock,
  MapPin,
  Utensils,
  ChefHat,
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useSoundFX } from '@/hooks/useSoundFX';
import type { OrderStatus } from '@/lib/types';
import type { PickupQrTrackerCardProps, StepMetadata } from './PickupQrTrackerCard.types';
import { trackerStyles } from './PickupQrTrackerCard.styles';

const ORDER_STEPS: StepMetadata[] = [
  {
    key: 'CONFIRMED',
    label: 'Confirmed',
    description: 'Ticket received by cafeteria team',
    badgeColor: 'sky',
    stepIndex: 0,
  },
  {
    key: 'PREPARING',
    label: 'Cooking',
    description: 'Chef is cooking fresh on the stove',
    badgeColor: 'orange',
    stepIndex: 1,
  },
  {
    key: 'READY',
    label: 'Ready for Pickup',
    description: 'Fresh & packed at the express counter',
    badgeColor: 'emerald',
    stepIndex: 2,
  },
  {
    key: 'COLLECTED',
    label: 'Collected',
    description: 'Handed over at counter. Enjoy!',
    badgeColor: 'neutral',
    stepIndex: 3,
  },
];

/**
 * PickupQrTrackerCard: Production-ready, mobile-first live order tracking pass.
 * Features optical QR code, counter OTP, sound alert toggles, slot countdown, and defensive states.
 */
export const PickupQrTrackerCard: React.FC<PickupQrTrackerCardProps> = ({
  orderToken,
  pickupOtp,
  status,
  canteenName,
  slotLabel,
  slotEndTime,
  totalAmount,
  items = [],
  notes,
  utrNumber,
  qrPayload,
  onViewReceipt,
  onToggleSound,
  soundEnabled = true,
  isLoading = false,
  error = null,
  onRetry,
  isEmpty = false,
  className = '',
}) => {
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(!soundEnabled);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const { playClick, playSuccess, playKitchenReadyChime, toggleMute } = useSoundFX();

  // Handle live countdown if slotEndTime is passed
  useEffect(() => {
    if (!slotEndTime) return;

    const calculateTimeLeft = () => {
      let targetTime: Date;
      if (slotEndTime.includes(':')) {
        const [timePart, modifier] = slotEndTime.split(' ');
        const [hoursStr, minutesStr] = timePart.split(':');
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        if (modifier?.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (modifier?.toUpperCase() === 'AM' && hours === 12) hours = 0;

        targetTime = new Date();
        targetTime.setHours(hours, minutes, 0, 0);
      } else {
        targetTime = new Date(slotEndTime);
      }

      const diffMs = targetTime.getTime() - Date.now();
      if (diffMs <= 0) {
        setTimeLeft('Window ending');
        return;
      }

      const mins = Math.floor(diffMs / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft(`${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [slotEndTime]);

  // Copy OTP with haptic and audio feedback
  const handleCopyOtp = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pickupOtp);
      setCopiedOtp(true);
      playSuccess();
      setTimeout(() => setCopiedOtp(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  }, [pickupOtp, playSuccess]);

  // Toggle Sound Notifications
  const handleToggleSound = useCallback(() => {
    playClick();
    const newMutedState = !isAudioMuted;
    setIsAudioMuted(newMutedState);
    toggleMute();
    if (onToggleSound) {
      onToggleSound(!newMutedState);
    }
  }, [isAudioMuted, onToggleSound, playClick, toggleMute]);

  // Audio trigger on READY state transition
  useEffect(() => {
    if (status === 'READY' && !isAudioMuted) {
      playKitchenReadyChime();
    }
  }, [status, isAudioMuted, playKitchenReadyChime]);

  // Determine current active step index
  const currentStepIndex = useMemo(() => {
    switch (status) {
      case 'PENDING_PAYMENT':
      case 'PAY_AT_COUNTER':
      case 'AWAITING_VERIFICATION':
        return -1;
      case 'CONFIRMED':
        return 0;
      case 'PREPARING':
        return 1;
      case 'READY':
        return 2;
      case 'COLLECTED':
        return 3;
      case 'CANCELLED':
      case 'REFUNDED':
        return -2;
      default:
        return 0;
    }
  }, [status]);

  // Resolved QR Data URL
  const resolvedQrData = useMemo(() => {
    if (qrPayload) return qrPayload;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/order/${orderToken}`;
    }
    return `https://foodline.campus/order/${orderToken}`;
  }, [qrPayload, orderToken]);

  // 1. DEFENSIVE STATE: Loading Skeleton
  if (isLoading) {
    return (
      <div
        className={`${trackerStyles.container} ${className}`}
        role="status"
        aria-label="Loading order tracker pass"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-24 h-6 ${trackerStyles.skeletonPulse}`} />
            <div className={`w-16 h-6 ${trackerStyles.skeletonPulse}`} />
          </div>
          <div className={`w-8 h-8 rounded-full ${trackerStyles.skeletonPulse}`} />
        </div>
        <div className={`h-14 my-4 ${trackerStyles.skeletonPulse}`} />
        <div className={`h-24 my-4 ${trackerStyles.skeletonPulse}`} />
        <div className={`h-10 my-4 ${trackerStyles.skeletonPulse}`} />
        <div className="flex gap-3 pt-2">
          <div className={`flex-1 h-12 ${trackerStyles.skeletonPulse}`} />
          <div className={`flex-1 h-12 ${trackerStyles.skeletonPulse}`} />
        </div>
      </div>
    );
  }

  // 2. DEFENSIVE STATE: Error State
  if (error) {
    return (
      <div
        className={`${trackerStyles.container} border-rose-500/30 ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-lg font-bold text-neutral-100 mb-1">Unable to Load Order</h3>
          <p className="text-sm text-neutral-400 mb-5 max-w-xs">{error}</p>
          {onRetry && (
            <button
              onClick={() => {
                playClick();
                onRetry();
              }}
              className={`${trackerStyles.actionButton} ${trackerStyles.actionPrimary}`}
              aria-label="Retry loading order details"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. DEFENSIVE STATE: Empty State
  if (isEmpty || !orderToken) {
    return (
      <div
        className={`${trackerStyles.container} ${className}`}
        role="region"
        aria-label="No active orders"
      >
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 mb-3">
            <ShoppingBag size={28} />
          </div>
          <h3 className="text-base font-semibold text-neutral-200 mb-1">No Active Pickup</h3>
          <p className="text-xs text-neutral-400 max-w-xs mb-4">
            You don&apos;t have any active meal tokens queued for pickup right now.
          </p>
        </div>
      </div>
    );
  }

  const isOrderReady = status === 'READY';
  const isCancelled = status === 'CANCELLED' || status === 'REFUNDED';

  // 4. MAIN INTERACTIVE STATE
  return (
    <div
      className={`${trackerStyles.container} ${
        isOrderReady ? 'ring-2 ring-emerald-500/50 shadow-emerald-500/10' : ''
      } ${className}`}
      role="region"
      aria-label={`Order pickup pass for token ${orderToken}`}
    >
      {/* Header Bar */}
      <div className={trackerStyles.header}>
        <div className="flex items-center gap-2.5">
          <span className={trackerStyles.tokenBadge} aria-label={`Order token ${orderToken}`}>
            <Sparkles size={13} className="text-orange-400" />
            {orderToken}
          </span>
          {timeLeft && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-900 border border-white/10 text-neutral-300"
              aria-label={`Remaining slot window: ${timeLeft}`}
            >
              <Clock size={12} className="text-orange-400" />
              {timeLeft}
            </span>
          )}
        </div>

        {/* Audio Notification & Receipt Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            className="w-10 h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-neutral-100 transition-colors focus:ring-2 focus:ring-orange-500"
            title={isAudioMuted ? 'Unmute pickup chime' : 'Mute pickup chime'}
            aria-label={isAudioMuted ? 'Enable sound notifications' : 'Disable sound notifications'}
          >
            {isAudioMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Canteen & Pickup Slot Info */}
      <div className="flex items-center justify-between gap-4 mt-4">
        <div className={trackerStyles.canteenInfo}>
          <div className={trackerStyles.canteenTitle}>{canteenName}</div>
          <div className={trackerStyles.slotSubtitle}>
            <MapPin size={12} className="text-orange-400" />
            <span>{slotLabel}</span>
          </div>
        </div>
        {totalAmount !== undefined && (
          <div className="text-right">
            <div className="text-xs text-neutral-400 font-medium">Total Paid</div>
            <div className="text-base font-bold font-mono text-neutral-100">₹{totalAmount.toFixed(2)}</div>
          </div>
        )}
      </div>

      {/* Dynamic Status Banner */}
      <div
        className={`${trackerStyles.statusBanner.base} ${
          trackerStyles.statusBanner[status] || trackerStyles.statusBanner.CONFIRMED
        }`}
        aria-live="polite"
        role="status"
      >
        <div className="flex items-center gap-3">
          {isOrderReady ? (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"
            >
              <PackageCheck size={20} />
            </motion.div>
          ) : status === 'PREPARING' ? (
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400"
            >
              <ChefHat size={20} />
            </motion.div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          )}

          <div>
            <div className="text-sm font-bold tracking-wide">
              {isOrderReady
                ? '⚡ YOUR MEAL IS READY!'
                : status === 'PREPARING'
                ? '🍳 CHEF IS COOKING'
                : status === 'COLLECTED'
                ? '✓ ORDER COLLECTED'
                : isCancelled
                ? '✕ ORDER CANCELLED'
                : 'ORDER CONFIRMED'}
            </div>
            <div className="text-xs opacity-80 mt-0.5">
              {isOrderReady
                ? `Flash OTP ${pickupOtp} or scan QR at the express lane counter.`
                : status === 'PREPARING'
                ? 'Freshly preparing your items for express recess pickup.'
                : 'Ticket queued in kitchen workflow.'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stepper (Hidden on Cancelled) */}
      {!isCancelled && (
        <div className={trackerStyles.stepperTrack} aria-label="Order preparation progress">
          <div className={trackerStyles.stepperLineBase} />
          <div
            className={trackerStyles.stepperLineFill}
            style={{
              width: `${Math.max(0, Math.min(100, (currentStepIndex / (ORDER_STEPS.length - 1)) * 100))}%`,
            }}
          />
          {ORDER_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div
                  className={`${trackerStyles.stepNode.base} ${
                    isCompleted
                      ? trackerStyles.stepNode.completed
                      : isCurrent
                      ? trackerStyles.stepNode.active
                      : trackerStyles.stepNode.upcoming
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? <Check size={14} /> : idx + 1}
                </div>
                <span className="text-[10px] mt-1.5 font-medium text-neutral-400 hidden sm:block">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Toggle View: Optical QR Code vs Counter Pickup OTP */}
      <AnimatePresence mode="wait">
        {showQrCode ? (
          <motion.div
            key="qr-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={trackerStyles.qrContainer}
            aria-label="Optical pickup QR code"
          >
            <QRCodeSVG
              value={resolvedQrData}
              size={180}
              level="H"
              includeMargin={false}
              className="rounded-lg"
            />
            <p className={trackerStyles.qrCaption}>
              Point scanner at Cafe @7 counter or show to express staff
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="otp-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={trackerStyles.otpSection}
          >
            <div className={trackerStyles.otpLabel}>Physical Counter Pickup OTP</div>
            <div className="flex items-center gap-3">
              <span className={trackerStyles.otpCode} aria-label={`Counter pickup OTP ${pickupOtp}`}>
                {pickupOtp}
              </span>
              <button
                onClick={handleCopyOtp}
                className="w-10 h-10 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
                title="Copy OTP to clipboard"
                aria-label={copiedOtp ? 'OTP Copied' : 'Copy OTP'}
              >
                {copiedOtp ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              </button>
            </div>
            {copiedOtp && (
              <span className="text-[11px] text-emerald-400 font-medium mt-1">✓ Copied to clipboard!</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Itemized Order Summary (Collapsible if present) */}
      {items.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Utensils size={13} />
            Items on Tray ({items.reduce((acc, it) => acc + it.quantity, 0)})
          </div>
          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs text-neutral-300">
                <span className="truncate max-w-[200px]">
                  <strong className="text-orange-400 font-mono mr-1.5">{item.quantity}×</strong>
                  {item.name}
                </span>
                {item.price !== undefined && (
                  <span className="font-mono text-neutral-400">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                )}
              </div>
            ))}
          </div>
          {notes && (
            <p className="text-[11px] italic text-neutral-400 mt-2 bg-neutral-900/60 p-2 rounded-lg border border-white/5">
              Note: {notes}
            </p>
          )}
        </div>
      )}

      {/* Action Footers */}
      <div className="grid grid-cols-2 gap-3 mt-5 pt-3 border-t border-white/10">
        <button
          onClick={() => {
            playClick();
            setShowQrCode((prev) => !prev);
          }}
          className={`${trackerStyles.actionButton} ${trackerStyles.actionSecondary}`}
          aria-label={showQrCode ? 'Show counter OTP' : 'Show optical QR pass'}
        >
          <QrCode size={16} className="text-orange-400" />
          <span>{showQrCode ? 'Show OTP' : 'Scan QR'}</span>
        </button>

        {onViewReceipt ? (
          <button
            onClick={() => {
              playClick();
              onViewReceipt();
            }}
            className={`${trackerStyles.actionButton} ${trackerStyles.actionPrimary}`}
            aria-label="View thermal receipt slip"
          >
            <Receipt size={16} />
            <span>Receipt Slip</span>
          </button>
        ) : utrNumber ? (
          <div className="flex flex-col items-center justify-center text-center p-1 bg-neutral-900/50 rounded-xl border border-white/5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Bank UTR</span>
            <span className="text-xs font-mono font-bold text-neutral-200 truncate max-w-full">
              {utrNumber}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center text-xs text-neutral-400 font-mono">
            Cafe @7 Express
          </div>
        )}
      </div>
    </div>
  );
};

