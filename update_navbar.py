import os

APP_DIR = r"C:\Users\Shivam Manoj Nirmal\Desktop\FoodLine App"

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
            href="/login"
            className="text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/5 transition cursor-pointer"
          >
            🎓 Login
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

def main():
    target_path = os.path.join(APP_DIR, "src", "components", "navbar.tsx")
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(NAVBAR_TSX.strip() + "\n")
    print(f"Updated: {target_path}")

if __name__ == "__main__":
    main()
