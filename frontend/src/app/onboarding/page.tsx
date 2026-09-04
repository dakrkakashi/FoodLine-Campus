'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Clock,
  Store,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageTransition, SpotlightCard } from '@/components/ui';
import { ShimmerButton } from '@/components/magicui/shimmer-button';
import { Meteors } from '@/components/magicui/meteors';

const SLIDES = [
  {
    id: 1,
    badge: 'ZERO QUEUE WAITING',
    title: 'Skip the 25-Minute Canteen Rush',
    description:
      'Pre-order fresh campus meals from your lecture hall or hostel. Walk straight to the dedicated FoodLine express counter when the bell rings.',
    icon: '⚡',
    metric: '< 60s',
    metricLabel: 'Express Handover Time',
    accent: '#FF6B2C',
  },
  {
    id: 2,
    badge: '5 REGISTERED CAMPUS OUTLETS',
    title: 'All Your College Canteens in One App',
    description:
      'Order from Cafe @7, South Corner Dosa Bar, Nescafe Kiosk, MBA Cafeteria, and Central Hostel Mess. Live inventory with zero price markups.',
    icon: '🏢',
    metric: '5 Outlets',
    metricLabel: 'On Sanjivani Campus',
    accent: '#00D4AA',
  },
  {
    id: 3,
    badge: '10-MINUTE BREAK BELL SYNC',
    title: 'Batch-Cooked for Your Exact Break Slot',
    description:
      '60-order throttled capacity prevents kitchen congestion. Food is packed piping hot exactly for 11:50 AM Lunch or 2:30 PM Snack break.',
    icon: '⏱️',
    metric: '100%',
    metricLabel: 'Fresh & FSSAI Certified',
    accent: '#FFB347',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      router.push('/select-campus');
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <PageTransition className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] pb-24 relative overflow-hidden flex flex-col justify-between transition-colors duration-500">
      {/* Background Meteors & Radials */}
      <div className="absolute inset-0 pointer-events-none">
        <Meteors number={20} />
      </div>

      <div className="aurora-mesh pointer-events-none">
        <div className="aurora-blob w-[36rem] h-[36rem] bg-[#FF6B2C] -top-24 -right-20" style={{ animationDuration: '22s' }} />
        <div className="aurora-blob w-[38rem] h-[38rem] bg-[#00D4AA] top-1/2 -left-32" style={{ animationDuration: '26s', animationDelay: '-8s' }} />
      </div>

      <Navbar />

      <main className="max-w-xl mx-auto px-4 pt-8 w-full flex-1 flex flex-col justify-center relative z-10">
        {/* Progress Stepper Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx
                  ? 'w-8 bg-[#FF6B2C] shadow-md shadow-[#FF6B2C]/50'
                  : 'w-2 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Slide Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: 'spring', stiffness: 320, damping: 25 }}
          >
            <SpotlightCard
              spotlightColor="rgba(255, 107, 44, 0.22)"
              className="p-8 sm:p-10 rounded-[2.5rem] border border-[var(--border-glass)] bg-[var(--bg-card)] backdrop-blur-2xl shadow-2xl text-center relative overflow-hidden"
            >
              {/* Top Accent Radial */}
              <div
                className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
                style={{ backgroundColor: slide.accent }}
              />

              {/* Big Icon */}
              <div className="w-20 h-20 mx-auto rounded-3xl bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] flex items-center justify-center text-4xl shadow-inner mb-6">
                {slide.icon}
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] text-[10px] font-black uppercase tracking-widest text-[#FFB347] mb-3">
                <Sparkles size={11} />
                <span>{slide.badge}</span>
              </div>

              {/* Heading & Copy */}
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight leading-snug mb-3">
                {slide.title}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto mb-8 font-medium">
                {slide.description}
              </p>

              {/* Metric Callout */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-glass)] max-w-xs mx-auto mb-8 shadow-inner">
                <div className="text-2xl sm:text-3xl font-black font-mono text-[var(--text-primary)] tracking-tight" style={{ color: slide.accent }}>
                  {slide.metric}
                </div>
                <div className="text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider mt-0.5">
                  {slide.metricLabel}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <ShimmerButton
                  shimmerColor="#FFFFFF"
                  shimmerDuration="2.5s"
                  background="linear-gradient(to right, #FF6B2C, #FF8A3D, #FFB347)"
                  borderRadius="1.25rem"
                  className="w-full py-4 text-white font-black text-sm shadow-xl shadow-[#FF6B2C]/30 cursor-pointer"
                  onClick={nextSlide}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>{currentSlide === SLIDES.length - 1 ? 'Get Started →' : 'Continue'}</span>
                    {currentSlide < SLIDES.length - 1 && <ChevronRight size={16} strokeWidth={3} />}
                  </span>
                </ShimmerButton>

                <div className="pt-2 flex items-center justify-between gap-4 text-xs font-bold text-[var(--text-secondary)]">
                  <Link href="/login" className="hover:text-[var(--text-primary)] transition flex items-center gap-1">
                    <GraduationCap size={14} className="text-[#00D4AA]" />
                    <span>Student PRN Login</span>
                  </Link>

                  <Link href="/select-campus" className="hover:text-[var(--text-primary)] transition flex items-center gap-1">
                    <MapPin size={14} className="text-[#FF6B2C]" />
                    <span>Browse Colleges</span>
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </AnimatePresence>
      </main>
    </PageTransition>
  );
}
