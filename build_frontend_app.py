import os
import json

APP_DIR = r"C:\Users\Shivam Manoj Nirmal\Desktop\FoodLine App"

def create_file(rel_path, content):
    full_path = os.path.join(APP_DIR, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Built: {rel_path}")

# =========================================================================
# 1. UI COMPONENTS (LUCIDE SVG ICONS & SHADCN PRIMITIVES)
# =========================================================================

ICONS_TSX = """
import React from 'react';

export function SparklesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

export function ClockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function QrCodeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
    </svg>
  );
}

export function CheckCircleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function ShoppingBagIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
"""

NAVBAR_TSX = """
'use client';

import React from 'react';
import Link from 'next/link';

export function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  return (
    <header className="sticky top-0 bg-[#0A0A0F]/85 backdrop-blur-xl border-b border-white/10 z-50 px-4 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] flex items-center justify-center font-black text-lg text-black shadow-lg shadow-[#FF6B2C]/20 group-hover:scale-105 transition">
            ⚡
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#FF6B2C] via-[#FFB347] to-white bg-clip-text text-transparent">
              FoodLine
            </span>
            <span className="hidden md:inline-block ml-2 text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#16161E] border border-white/10 text-[#00D4AA] font-bold">
              Cafe @7 Pilot
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-3">
          <Link
            href="/menu"
            className="text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 transition cursor-pointer"
          >
            🍽️ Menu
          </Link>
          <Link
            href="/kds"
            className="text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 transition cursor-pointer hidden sm:inline-block"
          >
            🍳 Kitchen KDS
          </Link>
          <Link
            href="/admin"
            className="text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 transition cursor-pointer hidden sm:inline-block"
          >
            📊 Analytics
          </Link>
          
          <Link
            href="/menu"
            className="flex items-center gap-2 text-xs sm:text-sm font-extrabold bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white px-4 py-2 rounded-xl shadow-lg shadow-[#FF6B2C]/25 transition active:scale-95 cursor-pointer"
          >
            <span>Order</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#FF6B2C] flex items-center justify-center text-[11px] font-black">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
"""

# =========================================================================
# 2. ENHANCED ADMIN ANALYTICS PAGE
# =========================================================================

ADMIN_PAGE_TSX = """
'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/navbar';

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="text-xs font-bold text-[#FFB347] uppercase tracking-wider mb-1">
              Campus Canteen Operations
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Merchant Analytics & Demand Forecast
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Sanjivani University (Cafe @7) • Live Pilot Metrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Demand Tracking
            </span>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#16161E] border border-white/5 hover:border-white/10 transition">
            <div className="text-xs text-zinc-400 font-medium mb-1">Today's Gross GMV</div>
            <div className="text-3xl font-black text-white">₹32,450</div>
            <div className="text-xs text-[#00D4AA] font-bold mt-2">↑ 24% vs Last Week</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#16161E] border border-white/5 hover:border-white/10 transition">
            <div className="text-xs text-zinc-400 font-medium mb-1">Total Pre-Orders Today</div>
            <div className="text-3xl font-black text-white">584 Orders</div>
            <div className="text-xs text-[#00D4AA] font-bold mt-2">0% Dropouts During Rush</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#16161E] border border-white/5 hover:border-white/10 transition">
            <div className="text-xs text-zinc-400 font-medium mb-1">Avg. Express Handover</div>
            <div className="text-3xl font-black text-[#FFB347]">22 Seconds</div>
            <div className="text-xs text-zinc-400 mt-2">Target: ≤ 30 Seconds</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#16161E] border border-white/5 hover:border-white/10 transition">
            <div className="text-xs text-zinc-400 font-medium mb-1">Payment Gateway Fees Saved</div>
            <div className="text-3xl font-black text-[#00D4AA]">₹746 (100% Payout)</div>
            <div className="text-xs text-zinc-400 mt-2">Option C Direct UTR</div>
          </div>
        </div>

        {/* 2-Column Split: Slot Saturation & Top Dishes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Break Slot Saturation */}
          <div className="p-6 rounded-2xl bg-[#16161E] border border-white/5">
            <h2 className="text-lg font-bold text-white mb-1">Break Slot Capacity Saturation</h2>
            <p className="text-xs text-zinc-400 mb-6">Load balance across 10-minute intervals.</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Lunch Slot A (11:50 AM – 12:10 PM)</span>
                  <span className="text-[#FF6B2C]">54 / 60 (90% Full)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Lunch Slot B (12:10 PM – 12:30 PM)</span>
                  <span className="text-[#00D4AA]">38 / 60 (63% Capacity)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-[#00D4AA] rounded-full" style={{ width: '63%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Evening Slot (2:30 PM – 2:50 PM)</span>
                  <span className="text-[#8B5CF6]">31 / 45 (68% Capacity)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Dishes */}
          <div className="p-6 rounded-2xl bg-[#16161E] border border-white/5">
            <h2 className="text-lg font-bold text-white mb-1">Top Selling Campus Items</h2>
            <p className="text-xs text-zinc-400 mb-4">Ranked by volume ordered today.</p>

            <ul className="divide-y divide-white/5 text-xs">
              <li className="py-3 flex justify-between items-center">
                <span className="font-bold text-zinc-200">1. Hot Samosa & Vada Pav (₹20)</span>
                <span className="font-mono text-zinc-400 font-bold">142 orders</span>
              </li>
              <li className="py-3 flex justify-between items-center">
                <span className="font-bold text-zinc-200">2. Crispy Masala Dosa (₹50)</span>
                <span className="font-mono text-zinc-400 font-bold">98 orders</span>
              </li>
              <li className="py-3 flex justify-between items-center">
                <span className="font-bold text-zinc-200">3. Iced Cold Coffee (₹50)</span>
                <span className="font-mono text-zinc-400 font-bold">86 orders</span>
              </li>
              <li className="py-3 flex justify-between items-center">
                <span className="font-bold text-zinc-200">4. Veg. Cheese Grill Sandwich (₹100)</span>
                <span className="font-mono text-zinc-400 font-bold">64 orders</span>
              </li>
              <li className="py-3 flex justify-between items-center">
                <span className="font-bold text-zinc-200">5. Special Campus Tea (₹10)</span>
                <span className="font-mono text-zinc-400 font-bold">58 orders</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
"""

def main():
    print("Upgrading Frontend Components in:", APP_DIR)
    
    # 1. UI primitives & Icons
    create_file(os.path.join("src", "components", "icons.tsx"), ICONS_TSX)
    create_file(os.path.join("src", "components", "navbar.tsx"), NAVBAR_TSX)
    create_file(os.path.join("src", "app", "admin", "page.tsx"), ADMIN_PAGE_TSX)
    
    print("Frontend UI/UX upgrade complete!")

if __name__ == "__main__":
    main()
