'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Smartphone,
  Flame,
  CheckCircle2,
  ChevronDown,
  Timer,
  QrCode,
  Layers,
  ChefHat,
  UtensilsCrossed,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import {
  PageTransition,
  SpotlightCard,
  AnimatedText,
  TiltCard,
  CampusVisualizer,
} from '@/components/ui';
import { CampusHero3D } from '@/components/3d/CampusHero3D';
import { useSoundFX } from '@/hooks/useSoundFX';

const PILLARS = [
  {
    icon: <Clock size={28} strokeWidth={2.2} />,
    title: 'Order In Lecture',
    desc: 'Pre-order from the classroom 10 minutes before the bell rings without rushing.',
    color: 'var(--accent-orange, #FF6B2C)',
    spotlight: 'rgba(255, 107, 44, 0.25)',
    tag: 'Pre-Order Ready',
  },
  {
    icon: <Users size={28} strokeWidth={2.2} />,
    title: '60-Cap Break Slots',
    desc: 'Intelligent campus slot throttling automatically eliminates counter overcrowding.',
    color: 'var(--accent-amber, #FFB347)',
    spotlight: 'rgba(255, 179, 71, 0.25)',
    tag: 'Smart Queueing',
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={2.2} />,
    title: '0% Surcharge UPI',
    desc: 'Direct merchant settlement with fraud-proof 12-digit UTR sync & replay lock.',
    color: 'var(--accent-teal, #00D4AA)',
    spotlight: 'rgba(0, 212, 170, 0.25)',
    tag: 'Zero Platform Fee',
  },
  {
    icon: <Zap size={28} strokeWidth={2.2} />,
    title: '30-Sec Express Grab',
    desc: 'Flash your digital QR pass at the express lane and walk out with your hot tray.',
    color: 'var(--accent-purple, #8B5CF6)',
    spotlight: 'rgba(139, 92, 246, 0.25)',
    tag: 'Instant Handover',
  },
];

const SIGNATURE_DISHES = [
  {
    name: 'Special Butter Masala Dosa',
    price: '₹50',
    tag: 'Student Bestseller',
    category: 'South Indian',
    desc: 'Crispy golden crepe with spiced aloo masala, coconut chutney & hot sambar.',
    emoji: '🥞',
    steam: true,
  },
  {
    name: 'Cafe @7 Crispy Vada Pav (2x)',
    price: '₹30',
    tag: 'Campus Favorite',
    category: 'Fast Grab',
    desc: 'Hot spiced batata vada inside fresh pav with garlic thecha & fried chili.',
    emoji: '🥟',
    steam: true,
  },
  {
    name: 'Special Cutting Chai & Samosa',
    price: '₹35',
    tag: 'Quick Break',
    category: 'Hot Beverages',
    desc: 'Cardamom brewed hot tea paired with crunchy potato-pea samosa.',
    emoji: '☕',
    steam: true,
  },
];

const FAQS = [
  {
    q: 'How does the 60-Order Slot Throttling prevent rush?',
    a: 'Each campus break window (e.g., 10:15 AM - 10:30 AM) is capped at 60 orders max. Once filled, the system seamlessly redirects students to adjacent pickup slots so the counter never gets overloaded.',
  },
  {
    q: 'Is there any additional service charge on UPI payments?',
    a: 'No! FoodLine operates on 0% student surcharge. You pay the exact menu price directly to Cafe @7 via standard UPI (GPay, PhonePe, Paytm).',
  },
  {
    q: 'What if a dish is sold out before my break?',
    a: 'Cafe @7 staff use 1-Tap KDS Inventory toggles to immediately update dish availability across the campus in real-time, preventing out-of-stock orders.',
  },
  {
    q: 'Can I pick up food without waiting in the general line?',
    a: 'Yes! FoodLine orders have a dedicated express pickup counter. Just show your digital OTP or QR code to grab your prepared tray in under 30 seconds.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { playClick, playPop } = useSoundFX();

  return (
    <PageTransition className="min-h-screen flex flex-col justify-between bg-[var(--bg-canvas,#07070B)] text-[#F5F5F7] relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Aurora Gradient Mesh */}
      <div className="aurora-mesh">
        <div
          className="aurora-blob w-[38rem] h-[38rem] bg-[var(--accent-orange,#FF6B2C)] -top-32 -left-20"
          style={{ animationDuration: '18s' }}
        />
        <div
          className="aurora-blob w-[42rem] h-[42rem] bg-[var(--accent-purple,#8B5CF6)] top-1/3 -right-32"
          style={{ animationDuration: '22s', animationDelay: '-5s' }}
        />
        <div
          className="aurora-blob w-[36rem] h-[36rem] bg-[var(--accent-teal,#00D4AA)] -bottom-20 left-1/4"
          style={{ animationDuration: '20s', animationDelay: '-10s' }}
        />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-24 text-center flex-1 flex flex-col justify-center items-center">
        {/* Campus Live Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card-heavy text-xs font-black text-[var(--accent-amber,#FFB347)] mb-8 shadow-2xl border border-white/10"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-teal,#00D4AA)] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-teal,#00D4AA)]" />
          </span>
          <span className="tracking-wide">SANJIVANI UNIVERSITY • CAFE @7 EXPRESS LANE ACTIVE</span>
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white font-mono">0% Surcharge</span>
        </motion.div>

        {/* Headline with Animated Typography */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6 max-w-5xl">
          <AnimatedText text="Skip The 25-Min Line." type="words" delay={0.1} />
          <br />
          <span className="bg-gradient-to-r from-[var(--accent-orange,#FF6B2C)] via-[var(--accent-amber,#FFB347)] to-[var(--accent-teal,#00D4AA)] bg-clip-text text-transparent">
            Grab Hot Food In 30s.
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-base sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Order your favorite meals straight from lecture halls before break time. Experience smart slot batching, instant UPI verification, and hot tray express pickup.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16 w-full"
        >
          <Link href="/menu" onClick={playClick} className="w-full">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="w-full px-8 py-4.5 bg-gradient-to-r from-[var(--accent-orange,#FF6B2C)] via-[#FF8A3D] to-[var(--accent-amber,#FFB347)] text-black font-black text-base md:text-lg rounded-2xl shadow-2xl shadow-[var(--accent-orange,#FF6B2C)]/40 flex items-center justify-center gap-3 cursor-pointer group transition-all"
            >
              <span>Browse Cafe @7 Menu</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <Link href="/kds" onClick={playClick} className="w-full">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="w-full px-6 py-4.5 glass-interactive text-white font-extrabold text-base rounded-2xl flex items-center justify-center gap-2.5 shadow-xl cursor-pointer"
            >
              <span>🍳</span> Kitchen Live Station
            </motion.button>
          </Link>
        </motion.div>

        {/* Live Metrics Telemetry Bar */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl mx-auto mb-24"
        >
          <div className="glass-card rounded-2xl p-4 text-center border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-[var(--accent-orange,#FF6B2C)]">25m ➔ 30s</div>
            <div className="text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">Queue Time Cut</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-[var(--accent-amber,#FFB347)]">60 Max</div>
            <div className="text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">Cap Per Break Slot</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-[var(--accent-teal,#00D4AA)]">0% Fee</div>
            <div className="text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">Direct UPI Settle</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-[var(--accent-purple,#8B5CF6)]">44+</div>
            <div className="text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-wider">Pure Veg Dishes</div>
          </div>
        </motion.div>

        {/* Interactive Architecture Flow Visualizer */}
        <div className="w-full mb-24 text-left">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
              <Sparkles size={14} className="text-[var(--accent-teal)]" /> Interactive Campus Architecture
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              How FoodLine Powers Sanjivani Dining
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              From classroom pre-order to 30-second express pickup at Cafe @7 counter.
            </p>
          </div>

          <CampusVisualizer />
        </div>

        {/* 🚀 REALTIME 3D FOOD & EXPRESS TRAY SHOWCASE */}
        <div className="w-full mb-24 text-left">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B2C]/10 border border-[#FF6B2C]/30 text-xs font-black text-[#FFB347] uppercase tracking-widest mb-3">
              <Sparkles size={14} className="text-[#00D4AA]" /> Realtime WebGL 3D Food Lab
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Inspect Fresh Dishes in <span className="text-[#00D4AA]">360° 3D</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Drag with mouse or swipe on mobile to rotate 3D food models with live steam and lighting physics.
            </p>
          </div>

          <div className="max-w-3xl mx-auto w-full">
            <CampusHero3D />
          </div>
        </div>

        {/* 🍲 3D Tilt Signature Dishes Showcase with Steam Physics */}
        <div className="w-full text-left mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
              <Flame size={14} className="text-[var(--accent-orange)]" /> Hot From Cafe @7 Wok
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Signature Campus Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-2">
              Move your mouse to inspect 3D tilt physics & rising steam particles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SIGNATURE_DISHES.map((dish, i) => (
              <TiltCard key={i} steam={dish.steam} className="p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{dish.emoji}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--accent-orange)]/15 text-[var(--accent-amber)] border border-[var(--accent-orange)]/30">
                      {dish.tag}
                    </span>
                  </div>

                  <h3 className="font-black text-xl text-white mb-2">{dish.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{dish.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Price</span>
                    <div className="text-2xl font-black text-white">{dish.price}</div>
                  </div>
                  <Link href="/menu" onClick={playPop}>
                    <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[var(--accent-orange)] hover:text-black font-black text-xs transition cursor-pointer">
                      Order Now →
                    </button>
                  </Link>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* 4 Interactive Spotlight Pillars */}
        <div className="w-full text-left mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
              <Sparkles size={14} className="text-[var(--accent-amber)]" /> Core Campus Pillars
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Engineered For Zero Friction
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p, i) => (
              <SpotlightCard
                key={i}
                spotlightColor={p.spotlight}
                delay={i * 0.1}
                className="p-7 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${p.color}18`,
                        border: `1px solid ${p.color}35`,
                        color: p.color,
                      }}
                    >
                      {p.icon}
                    </div>
                    <span
                      className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${p.color}15`,
                        color: p.color,
                        border: `1px solid ${p.color}25`,
                      }}
                    >
                      {p.tag}
                    </span>
                  </div>

                  <h3 className="font-black text-xl text-white mb-2.5 tracking-tight group-hover:text-[var(--accent-amber)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Interactive FAQ Section */}
        <div className="w-full max-w-3xl mx-auto text-left mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">Everything you need to know about FoodLine at Cafe @7</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => {
                      playClick();
                      setOpenFaq(isOpen ? null : idx);
                    }}
                    className="w-full p-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-zinc-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[var(--accent-orange)]' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Giant Bottom CTA Card */}
        <SpotlightCard
          spotlightColor="rgba(255, 107, 44, 0.35)"
          className="w-full p-8 md:p-14 text-center rounded-[2.5rem] border-2 border-[var(--accent-orange)]/30 relative overflow-hidden"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-orange)]/20 border border-[var(--accent-orange)]/40 text-[var(--accent-amber)] text-xs font-black uppercase tracking-wider mb-4">
              <Flame size={14} /> Ready for your next break?
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              Pre-Order Now & Beat The Rush
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 mb-8 font-medium leading-relaxed">
              Join hundreds of Sanjivani University students saving 20+ minutes every day during campus breaks.
            </p>
            <Link href="/menu" onClick={playClick}>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="px-10 py-4.5 bg-gradient-to-r from-[var(--accent-orange)] via-[#FF8A3D] to-[var(--accent-amber)] text-black font-black text-base md:text-lg rounded-2xl shadow-2xl shadow-[var(--accent-orange)]/50 cursor-pointer inline-flex items-center gap-3"
              >
                <span>Go to Cafe @7 Menu</span>
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </div>
        </SpotlightCard>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10 px-4 text-center text-xs text-zinc-500 bg-[var(--bg-canvas,#07070B)]/90 backdrop-blur-xl transition-colors duration-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--accent-orange)] to-[var(--accent-amber)] flex items-center justify-center text-black font-black text-sm">
              🍽
            </div>
            <span className="font-extrabold text-white text-sm">FoodLine Campus Dining Ecosystem</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-bold">
            <Link href="/terms" className="hover:text-[var(--accent-orange)] transition">Terms & Conditions</Link>
            <Link href="/menu" className="hover:text-white transition">Cafe @7 Menu</Link>
            <Link href="/display" className="hover:text-white transition">TV Display</Link>
            <Link href="/kds" className="hover:text-white transition">Kitchen KDS</Link>
          </div>

          <span className="text-zinc-500">Sanjivani University, Kopargaon</span>
        </div>
      </footer>
    </PageTransition>
  );
}
