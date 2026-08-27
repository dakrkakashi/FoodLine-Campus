import os
import json

APP_DIR = r"C:\Users\Shivam Manoj Nirmal\Desktop\FoodLine App"

def create_file(rel_path, content):
    full_path = os.path.join(APP_DIR, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created: {rel_path}")

# =========================================================================
# 1. ROOT CONFIGURATION FILES
# =========================================================================

PACKAGE_JSON = """
{
  "name": "foodline-app",
  "version": "1.0.0",
  "private": true,
  "description": "FoodLine: Next-Generation Campus Pre-Ordering, Slot Throttling & Express Pickup Ecosystem",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^12.0.0",
    "@supabase/supabase-js": "^2.47.0",
    "lucide-react": "^0.468.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "qrcode.react": "^4.1.0"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.1",
    "tailwindcss": "^4.0.0",
    "eslint": "^9.17.0"
  }
}
"""

TSCONFIG_JSON = """
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
"""

GITIGNORE = """
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
"""

README_MD = """
# 🚀 FoodLine App — Campus Pre-Ordering & Express Pickup Ecosystem

> **"Skip the Line, Not the Meal."**  
> Purpose-built for Indian University Campuses.  
> **Target Pilot:** Sanjivani University, Kopargaon (Cafe @7)

---

## 🌟 Key Features
- 📱 **Browse & Order Ahead:** Pre-order meals directly from classrooms before breaks.
- 🎯 **Smart Slot Throttling:** 10-minute dynamic break slots to balance kitchen load.
- 💰 **Option C Zero-Fee UPI:** Direct merchant standee QR payment with 12-digit bank UTR verification.
- ⚡ **30-Second Express Handover:** Optical QR pass & 4-digit token verification.
- 🍳 **Kitchen Display System (KDS):** Slot-batched orders with instant stock toggles.
- 📊 **Merchant Analytics:** Turnover, peak rush velocity, and menu engineering.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Dark High-Contrast Tokens
- **Animations:** Motion
- **Database / Real-Time:** Supabase PostgreSQL + Server-Sent Events (SSE)

---

## 🚀 Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```
"""

# =========================================================================
# 2. DATA LAYER (Cafe @7 Full Menu & Campus Config)
# =========================================================================

MENU_DATA = [
  {"id": "m1", "name": "Dabeli", "category": "Quick Bites", "price": 20, "prepTime": 2, "tag": "Fast Grab", "isVeg": True},
  {"id": "m2", "name": "Vada Pav", "category": "Quick Bites", "price": 20, "prepTime": 2, "tag": "Campus Classic", "isVeg": True},
  {"id": "m3", "name": "Poha", "category": "Quick Bites", "price": 25, "prepTime": 3, "tag": "Morning Breakfast", "isVeg": True},
  {"id": "m4", "name": "Samosa", "category": "Quick Bites", "price": 20, "prepTime": 2, "tag": "Fast Grab", "isVeg": True},
  {"id": "m5", "name": "Kachori", "category": "Quick Bites", "price": 20, "prepTime": 2, "tag": "Fast Grab", "isVeg": True},
  {"id": "m6", "name": "Cheese Grill Vada Pav", "category": "Quick Bites", "price": 50, "prepTime": 4, "tag": "Special Grab", "isVeg": True},
  {"id": "m7", "name": "Pani Puri", "category": "Chaat Corner", "price": 30, "prepTime": 3, "tag": "Chaat Corner", "isVeg": True},
  {"id": "m8", "name": "Sev Puri / Dahi Puri", "category": "Chaat Corner", "price": 40, "prepTime": 4, "tag": "Chaat Corner", "isVeg": True},
  {"id": "m9", "name": "Mumbai Bhel", "category": "Chaat Corner", "price": 40, "prepTime": 3, "tag": "Chaat Corner", "isVeg": True},
  {"id": "m10", "name": "Papdi Chat", "category": "Chaat Corner", "price": 40, "prepTime": 4, "tag": "Chaat Corner", "isVeg": True},
  {"id": "m11", "name": "Samosa Chole Tikki", "category": "Chaat Corner", "price": 50, "prepTime": 5, "tag": "Chaat Special", "isVeg": True},
  {"id": "m12", "name": "Aalu Chole Tikki", "category": "Chaat Corner", "price": 50, "prepTime": 5, "tag": "Chaat Special", "isVeg": True},
  {"id": "m13", "name": "Dahi Kachori", "category": "Chaat Corner", "price": 50, "prepTime": 4, "tag": "Chaat Special", "isVeg": True},
  {"id": "m14", "name": "Masala Dosa", "category": "South Indian", "price": 50, "prepTime": 6, "tag": "Bestseller", "isVeg": True},
  {"id": "m15", "name": "Cheese Masala Dosa", "category": "South Indian", "price": 80, "prepTime": 7, "tag": "Special Dosa", "isVeg": True},
  {"id": "m16", "name": "Onion Uttapa", "category": "South Indian", "price": 50, "prepTime": 6, "tag": "South Indian", "isVeg": True},
  {"id": "m17", "name": "Cheese Onion Uttapa", "category": "South Indian", "price": 80, "prepTime": 7, "tag": "Special Uttapa", "isVeg": True},
  {"id": "m18", "name": "Chole Bhature", "category": "North Indian", "price": 100, "prepTime": 8, "tag": "North Special", "isVeg": True},
  {"id": "m19", "name": "Veg. Sandwich", "category": "Sandwiches", "price": 60, "prepTime": 5, "tag": "Classic", "isVeg": True},
  {"id": "m20", "name": "Veg. Cheese Sandwich", "category": "Sandwiches", "price": 80, "prepTime": 5, "tag": "Cheesy", "isVeg": True},
  {"id": "m21", "name": "Veg. Cheese Grill Sandwich", "category": "Sandwiches", "price": 100, "prepTime": 7, "tag": "Hot Grill", "isVeg": True},
  {"id": "m22", "name": "Bombay Grill Sandwich", "category": "Sandwiches", "price": 110, "prepTime": 8, "tag": "Signature", "isVeg": True},
  {"id": "m23", "name": "Cutlet Club Sandwich", "category": "Sandwiches", "price": 90, "prepTime": 7, "tag": "Triple Decker", "isVeg": True},
  {"id": "m24", "name": "Veg Fried Momo", "category": "Momos & Burgers", "price": 70, "prepTime": 6, "tag": "Hot Momo", "isVeg": True},
  {"id": "m25", "name": "Paneer Fried Momo", "category": "Momos & Burgers", "price": 90, "prepTime": 7, "tag": "Paneer Momo", "isVeg": True},
  {"id": "m26", "name": "Aalu Tikki Burger", "category": "Momos & Burgers", "price": 70, "prepTime": 6, "tag": "Burger", "isVeg": True},
  {"id": "m27", "name": "Veg Cheese Burger", "category": "Momos & Burgers", "price": 80, "prepTime": 6, "tag": "Cheese Burger", "isVeg": True},
  {"id": "m28", "name": "Cheese Burst Burger", "category": "Momos & Burgers", "price": 90, "prepTime": 8, "tag": "Chef Special", "isVeg": True},
  {"id": "m29", "name": "Salted Fries", "category": "Fries & Pasta", "price": 60, "prepTime": 4, "tag": "Crispy", "isVeg": True},
  {"id": "m30", "name": "Peri Peri Fries", "category": "Fries & Pasta", "price": 80, "prepTime": 4, "tag": "Student Fav", "isVeg": True},
  {"id": "m31", "name": "Pink Sauce Pasta", "category": "Fries & Pasta", "price": 100, "prepTime": 8, "tag": "Italian", "isVeg": True},
  {"id": "m32", "name": "Arrabiata Pasta", "category": "Fries & Pasta", "price": 130, "prepTime": 8, "tag": "Spicy Red", "isVeg": True},
  {"id": "m33", "name": "White Sauce Pasta", "category": "Fries & Pasta", "price": 150, "prepTime": 10, "tag": "Creamy Alfredo", "isVeg": True},
  {"id": "m34", "name": "Plain Garlic Bread", "category": "Garlic Bread & Pizza", "price": 80, "prepTime": 6, "tag": "Oven Baked", "isVeg": True},
  {"id": "m35", "name": "Cheese Chilli Toast", "category": "Garlic Bread & Pizza", "price": 100, "prepTime": 7, "tag": "Spicy Cheese", "isVeg": True},
  {"id": "m36", "name": "Cheese Garlic Bread", "category": "Garlic Bread & Pizza", "price": 110, "prepTime": 7, "tag": "Mozzarella", "isVeg": True},
  {"id": "m37", "name": "Veg Loaded Pizza", "category": "Garlic Bread & Pizza", "price": 130, "prepTime": 12, "tag": "7-Inch Pizza", "isVeg": True},
  {"id": "m38", "name": "Cheese Corn Delight Pizza", "category": "Garlic Bread & Pizza", "price": 130, "prepTime": 12, "tag": "Sweet Corn", "isVeg": True},
  {"id": "m39", "name": "Margherita Pizza", "category": "Garlic Bread & Pizza", "price": 140, "prepTime": 12, "tag": "Classic Cheese", "isVeg": True},
  {"id": "m40", "name": "Paneer Tandoori Pizza", "category": "Garlic Bread & Pizza", "price": 150, "prepTime": 14, "tag": "Desi Tandoori", "isVeg": True},
  {"id": "m41", "name": "Plain Maggie", "category": "Maggi & Chinese", "price": 40, "prepTime": 5, "tag": "2-Min Maggi", "isVeg": True},
  {"id": "m42", "name": "Veg Cheese Maggie", "category": "Maggi & Chinese", "price": 60, "prepTime": 6, "tag": "Cheese Maggi", "isVeg": True},
  {"id": "m43", "name": "Dry Manchurian", "category": "Maggi & Chinese", "price": 90, "prepTime": 8, "tag": "Indo-Chinese", "isVeg": True},
  {"id": "m44", "name": "Veg Fried Rice", "category": "Maggi & Chinese", "price": 90, "prepTime": 8, "tag": "Wok Rice", "isVeg": True},
  {"id": "m45", "name": "Schezwan Fried Rice", "category": "Maggi & Chinese", "price": 100, "prepTime": 9, "tag": "Spicy Rice", "isVeg": True},
  {"id": "m46", "name": "Paneer Chilli", "category": "Maggi & Chinese", "price": 130, "prepTime": 10, "tag": "Chinese Special", "isVeg": True},
  {"id": "m47", "name": "Special Campus Tea", "category": "Beverages", "price": 10, "prepTime": 2, "tag": "Campus Fuel", "isVeg": True},
  {"id": "m48", "name": "Hot Coffee", "category": "Beverages", "price": 20, "prepTime": 3, "tag": "Hot Brew", "isVeg": True},
  {"id": "m49", "name": "Hot Chocolate", "category": "Beverages", "price": 30, "prepTime": 3, "tag": "Cocoa", "isVeg": True},
  {"id": "m50", "name": "Cold Coffee", "category": "Beverages", "price": 50, "prepTime": 3, "tag": "Student Fav", "isVeg": True},
  {"id": "m51", "name": "Cold Chocolate", "category": "Beverages", "price": 50, "prepTime": 3, "tag": "Chilled Cocoa", "isVeg": True},
  {"id": "m52", "name": "Oreo Shake", "category": "Beverages", "price": 90, "prepTime": 4, "tag": "Thick Shake", "isVeg": True},
  {"id": "m53", "name": "KitKat Shake", "category": "Beverages", "price": 90, "prepTime": 4, "tag": "Thick Shake", "isVeg": True},
  {"id": "m54", "name": "Brownie Thick Shake", "category": "Beverages", "price": 110, "prepTime": 5, "tag": "Gourmet Shake", "isVeg": True},
  {"id": "m55", "name": "Hot Gulab Jamun with Ice-Cream", "category": "Desserts", "price": 80, "prepTime": 3, "tag": "Classic Sweet", "isVeg": True},
  {"id": "m56", "name": "Hot Brownie with Ice-Cream", "category": "Desserts", "price": 100, "prepTime": 4, "tag": "Sizzling", "isVeg": True}
]

CAMPUS_CONFIG = {
  "university": "Sanjivani University, Kopargaon (MH)",
  "outlet": "Cafe @7 (Main Campus Cafeteria)",
  "merchantUpiId": "9960091371@slc",
  "breaks": [
    {
      "label": "Lunch Break",
      "window": "11:50 AM – 12:30 PM",
      "slots": [
        {"id": "slot-lunch-a", "time": "11:50 AM – 12:10 PM", "capacity": 60, "available": 34},
        {"id": "slot-lunch-b", "time": "12:10 PM – 12:30 PM", "capacity": 60, "available": 48}
      ]
    },
    {
      "label": "Evening Snack Break",
      "window": "2:30 PM – 2:50 PM",
      "slots": [
        {"id": "slot-eve-a", "time": "2:30 PM – 2:50 PM", "capacity": 45, "available": 29}
      ]
    }
  ]
}

# =========================================================================
# 3. TYPESCRIPT TYPES & UTILITIES
# =========================================================================

TYPES_TS = """
export type Category = 
  | 'All' 
  | 'Quick Bites' 
  | 'Chaat Corner' 
  | 'South Indian' 
  | 'North Indian' 
  | 'Sandwiches' 
  | 'Momos & Burgers' 
  | 'Fries & Pasta' 
  | 'Garlic Bread & Pizza' 
  | 'Maggi & Chinese' 
  | 'Beverages' 
  | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  prepTime: number;
  tag: string;
  isVeg: boolean;
  image?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type OrderStatus = 
  | 'PENDING_PAYMENT' 
  | 'UTR_SUBMITTED' 
  | 'VERIFIED' 
  | 'PREPARING' 
  | 'READY' 
  | 'COLLECTED';

export interface BreakSlot {
  id: string;
  time: string;
  capacity: number;
  available: number;
}

export interface Order {
  id: string;
  orderToken: string;       // e.g. "FL-8492"
  pickupPin: string;        // e.g. "4921"
  studentPhone: string;
  items: CartItem[];
  slot: BreakSlot;
  totalAmount: number;
  utrNumber?: string;
  status: OrderStatus;
  createdAt: string;
}
"""

UTILS_TS = """
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
"""

# =========================================================================
# 4. TAILWIND GLOBALS CSS
# =========================================================================

GLOBALS_CSS = """
@import "tailwindcss";

:root {
  --bg-primary: #0A0A0F;
  --bg-secondary: #111118;
  --bg-card: #16161E;
  --bg-card-hover: #1C1C28;
  --bg-glass: rgba(22, 22, 30, 0.75);
  --bg-glass-border: rgba(255, 255, 255, 0.08);

  --accent-orange: #FF6B2C;
  --accent-amber: #FFB347;
  --accent-teal: #00D4AA;
  --accent-purple: #8B5CF6;
  --accent-blue: #3B82F6;

  --text-primary: #F5F5F7;
  --text-secondary: #A1A1AA;
  --text-muted: #71717A;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow-x: hidden;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: #27273A;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-orange);
}
"""

# =========================================================================
# 5. APP PAGES & ROUTING
# =========================================================================

LAYOUT_TSX = """
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FoodLine — Campus Pre-Ordering & Express Pickup Ecosystem',
  description: 'Skip the line, not the meal. Order ahead from class for 30-sec express collection at Sanjivani University Cafe @7.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0A0A0F] text-[#F5F5F7] antialiased selection:bg-[#FF6B2C] selection:text-white">
        {children}
      </body>
    </html>
  );
}
"""

PAGE_TSX = """
'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#0A0A0F] relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF6B2C]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#00D4AA]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B2C] to-[#FFB347] flex items-center justify-center font-black text-xl shadow-lg shadow-[#FF6B2C]/20">
            ⚡
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#FF6B2C] to-[#FFB347] bg-clip-text text-transparent">
              FoodLine
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs uppercase px-2 py-0.5 rounded-full bg-[#16161E] border border-white/10 text-[#00D4AA] font-semibold">
              Sanjivani Pilot
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link href="/kds" className="text-xs sm:text-sm text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition">
            🍳 Kitchen KDS
          </Link>
          <Link href="/menu" className="text-xs sm:text-sm font-bold bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white px-4 py-2 rounded-xl shadow-lg shadow-[#FF6B2C]/25 transition active:scale-95">
            Order Food →
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-6 py-12 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16161E] border border-white/10 text-xs font-semibold text-[#FFB347] mb-6">
          📍 Sanjivani University, Kopargaon • Cafe @7
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight mb-6">
          Skip the Line,<br />
          <span className="bg-gradient-to-r from-[#FF6B2C] via-[#FFB347] to-[#00D4AA] bg-clip-text text-transparent">
            Not the Meal.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Order from your classroom before the bell rings. Pay directly via 0% fee UPI, and pick up hot food at the express counter in under 30 seconds!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link href="/menu" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF6B2C] to-[#FF8C42] hover:opacity-95 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-[#FF6B2C]/30 transition transform hover:-translate-y-0.5 active:scale-95 text-center">
            🚀 Browse Cafe @7 Menu
          </Link>
          <Link href="/kds" className="w-full sm:w-auto px-6 py-4 bg-[#16161E] hover:bg-[#1C1C28] border border-white/10 text-white font-semibold text-base rounded-2xl transition text-center">
            Chef Dashboard
          </Link>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-[#16161E] border border-white/5">
            <div className="text-2xl mb-2">📱</div>
            <div className="font-bold text-sm text-white">Order in Class</div>
            <div className="text-xs text-zinc-400">Pre-order 5 mins before break</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#16161E] border border-white/5">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-bold text-sm text-white">10-Min Slots</div>
            <div className="text-xs text-zinc-400">No rush hour kitchen chaos</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#16161E] border border-white/5">
            <div className="text-2xl mb-2">💰</div>
            <div className="font-bold text-sm text-white">0% Fee UPI</div>
            <div className="text-xs text-zinc-400">Direct merchant QR & UTR</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#16161E] border border-white/5">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-bold text-sm text-white">30s Express</div>
            <div className="text-xs text-zinc-400">Scan QR pass & grab tray</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 text-center text-xs text-zinc-500 z-10">
        FoodLine Campus Dining Ecosystem • Built for Sanjivani University • © 2026
      </footer>
    </main>
  );
}
"""

MENU_PAGE_TSX = """
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import menuData from '../../data/menu.json';
import campusConfig from '../../data/campus.json';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');

  const categories = [
    'All',
    'Quick Bites',
    'Chaat Corner',
    'South Indian',
    'Sandwiches',
    'Momos & Burgers',
    'Fries & Pasta',
    'Garlic Bread & Pizza',
    'Maggi & Chinese',
    'Beverages',
    'Desserts'
  ];

  const filteredItems = menuData.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const totalItemCount = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menuData.find(m => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-32">
      {/* Top Sticky Header */}
      <header className="sticky top-0 bg-[#111118]/90 backdrop-blur-xl border-b border-white/10 z-40 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-extrabold text-lg text-white">FoodLine</span>
          </Link>
          <div className="text-xs bg-[#16161E] border border-white/10 px-3 py-1.5 rounded-full text-zinc-300">
            📍 Cafe @7 (Sanjivani)
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6">
        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search 44+ dishes (e.g. Dosa, Vada Pav, Cold Coffee)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 rounded-2xl bg-[#16161E] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B2C] text-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-[#FF6B2C] text-white shadow-md shadow-[#FF6B2C]/20'
                  : 'bg-[#16161E] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredItems.map(dish => {
            const qty = cart[dish.id] || 0;
            return (
              <div
                key={dish.id}
                className="p-4 rounded-2xl bg-[#16161E] border border-white/5 hover:border-white/10 flex items-center justify-between gap-4 transition group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-semibold text-[#FFB347]">{dish.tag}</span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-[#FF6B2C] transition">
                    {dish.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                    <span className="font-extrabold text-base text-white">₹{dish.price}</span>
                    <span>⏱️ {dish.prepTime} min</span>
                  </div>
                </div>

                {/* Add / Qty Control */}
                <div>
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(dish.id)}
                      className="px-4 py-2 rounded-xl bg-[#20202C] hover:bg-[#FF6B2C] text-white font-bold text-xs transition active:scale-95 border border-white/10 hover:border-transparent"
                    >
                      + ADD
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-[#FF6B2C] text-white px-2.5 py-1.5 rounded-xl font-bold text-xs shadow-md shadow-[#FF6B2C]/20">
                      <button onClick={() => removeFromCart(dish.id)} className="w-5 h-5 flex items-center justify-center hover:bg-black/20 rounded">
                        -
                      </button>
                      <span className="w-4 text-center">{qty}</span>
                      <button onClick={() => addToCart(dish.id)} className="w-5 h-5 flex items-center justify-center hover:bg-black/20 rounded">
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Floating Cart Bar */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 pointer-events-none">
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-gradient-to-r from-[#1C1C28] to-[#16161E] border border-white/15 shadow-2xl flex items-center justify-between pointer-events-auto backdrop-blur-xl">
            <div>
              <div className="text-xs text-zinc-400">{totalItemCount} Items Selected</div>
              <div className="text-lg font-black text-white">₹{totalAmount}</div>
            </div>
            <Link
              href="/checkout"
              className="px-6 py-3 rounded-xl bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-extrabold text-sm shadow-lg shadow-[#FF6B2C]/30 transition active:scale-95 flex items-center gap-2"
            >
              Select Break Slot →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
"""

CHECKOUT_PAGE_TSX = """
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import campusConfig from '../../data/campus.json';

export default function CheckoutPage() {
  const [selectedSlot, setSelectedSlot] = useState(campusConfig.breaks[0].slots[0].id);
  const [phone, setPhone] = useState('');

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-8 max-w-xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/menu" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">
          ← Back to Menu
        </Link>
        <span className="text-xs font-bold text-[#00D4AA]">Step 2 of 3</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
        Choose Break Slot
      </h1>
      <p className="text-xs sm:text-sm text-zinc-400 mb-6">
        Select your 10-minute pickup slot. The kitchen will batch-cook so your meal is hot & ready when you arrive!
      </p>

      {/* University Break Slots */}
      <div className="space-y-6 mb-8">
        {campusConfig.breaks.map(b => (
          <div key={b.label} className="p-4 rounded-2xl bg-[#16161E] border border-white/5">
            <div className="text-xs font-bold text-[#FFB347] uppercase tracking-wider mb-1">{b.label}</div>
            <div className="text-xs text-zinc-400 mb-3">{b.window}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {b.slots.map(s => {
                const isSelected = selectedSlot === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSlot(s.id)}
                    className={`p-3.5 rounded-xl border text-left transition active:scale-95 ${
                      isSelected
                        ? 'bg-[#FF6B2C]/15 border-[#FF6B2C] text-white shadow-lg shadow-[#FF6B2C]/10'
                        : 'bg-[#20202C] border-white/5 text-zinc-300 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-sm">{s.time}</div>
                    <div className="text-[11px] text-[#00D4AA] mt-1">🟢 {s.available} slots left</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Phone Number Input */}
      <div className="p-4 rounded-2xl bg-[#16161E] border border-white/5 mb-8">
        <label className="block text-xs font-bold text-zinc-300 mb-2">
          📱 Student Phone Number (For Token SMS & Backup)
        </label>
        <input
          type="tel"
          placeholder="e.g. 9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#20202C] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B2C] text-sm font-mono"
        />
      </div>

      {/* Proceed to Option C Payment */}
      <Link
        href="/payment"
        className="w-full block text-center py-4 bg-gradient-to-r from-[#FF6B2C] to-[#FF8C42] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-[#FF6B2C]/25 transition active:scale-95"
      >
        Proceed to 0% Fee UPI Payment →
      </Link>
    </div>
  );
}
"""

PAYMENT_PAGE_TSX = """
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PaymentPage() {
  const [utr, setUtr] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    if (utr.length < 6) {
      alert('Please enter a valid 12-digit bank UTR reference number.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-8 max-w-md mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/checkout" className="text-xs text-zinc-400 hover:text-white">
          ← Change Slot
        </Link>
        <span className="text-xs font-bold text-[#00D4AA]">Option C (0% Fee)</span>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Direct Merchant UPI</h1>
        <p className="text-xs text-zinc-400">Pay direct to Cafe @7 with ₹0 payment gateway commission.</p>
      </div>

      {/* QR Standee Card */}
      <div className="p-6 rounded-3xl bg-[#16161E] border border-white/10 text-center mb-6 shadow-2xl relative">
        <div className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">Amount Due</div>
        <div className="text-3xl font-black text-white mb-4">₹70</div>

        {/* Dummy QR Box */}
        <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl flex flex-col items-center justify-center shadow-lg mb-4">
          <div className="w-full h-full border-4 border-dashed border-zinc-900 flex flex-col items-center justify-center text-zinc-800">
            <span className="text-3xl mb-1">📱</span>
            <span className="text-[10px] font-bold">UPI QR STANDEE</span>
            <span className="text-[8px] text-zinc-500">Cafe @7 Official</span>
          </div>
        </div>

        <div className="text-xs font-mono bg-[#20202C] px-3 py-1.5 rounded-xl text-[#00D4AA] inline-block mb-2">
          UPI ID: 9960091371@slc
        </div>
        <div className="text-[11px] text-zinc-400">Pay via GPay, PhonePe, Paytm or CRED</div>
      </div>

      {/* Step 2: Enter UTR */}
      <div className="p-4 rounded-2xl bg-[#16161E] border border-white/10 mb-6">
        <label className="block text-xs font-bold text-zinc-200 mb-1">
          🔑 Enter 12-Digit Bank UTR / Ref No.
        </label>
        <p className="text-[11px] text-zinc-400 mb-3">Found on your GPay/PhonePe receipt after payment.</p>
        <input
          type="text"
          maxLength={12}
          placeholder="e.g. 423819028471"
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#20202C] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00D4AA] font-mono text-center tracking-widest text-base"
        />
      </div>

      {/* Verify Button or Success State */}
      {!verified ? (
        <button
          onClick={handleVerify}
          disabled={isVerifying || utr.length === 0}
          className="w-full py-4 rounded-2xl bg-[#00D4AA] hover:bg-[#00D4AA]/90 disabled:opacity-50 text-black font-extrabold text-base shadow-xl shadow-[#00D4AA]/20 transition active:scale-95"
        >
          {isVerifying ? 'Verifying with Bank Engine...' : 'Verify & Generate Express Pass →'}
        </button>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center">
          <div className="text-emerald-400 font-bold text-base mb-1">✔ Payment Verified!</div>
          <div className="text-xs text-zinc-300 mb-4">Your express order token has been issued.</div>
          <Link
            href="/order/FL-8492"
            className="block py-3 px-6 bg-[#FF6B2C] text-white font-extrabold text-sm rounded-xl shadow-lg transition active:scale-95"
          >
            View Express QR Pass (#FL-8492) →
          </Link>
        </div>
      )}
    </div>
  );
}
"""

ORDER_STATUS_PAGE_TSX = """
'use client';

import React from 'react';
import Link from 'next/link';

export default function OrderTrackingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] px-4 py-8 max-w-md mx-auto text-center">
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/menu" className="text-xs text-zinc-400 hover:text-white">
          ← Place Another Order
        </Link>
        <span className="text-xs bg-[#16161E] border border-white/10 px-3 py-1 rounded-full text-[#00D4AA]">
          ● Live Tracking
        </span>
      </div>

      {/* Token Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1C1C28] to-[#16161E] border border-white/10 shadow-2xl mb-6">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Order Pass Token</div>
        <div className="text-4xl font-black text-white font-mono tracking-tight mb-2">
          #FL-8492
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D4AA]/15 border border-[#00D4AA]/30 text-xs font-bold text-[#00D4AA]">
          Status: PREPARING IN KITCHEN
        </div>

        {/* Optical QR Pass Box */}
        <div className="w-52 h-52 mx-auto bg-white p-3 rounded-2xl flex flex-col items-center justify-center shadow-xl my-6">
          <div className="w-full h-full border-4 border-dashed border-zinc-900 flex flex-col items-center justify-center text-zinc-800">
            <span className="text-4xl mb-1">🎟️</span>
            <span className="text-xs font-mono font-bold">FL-8492-PASS</span>
            <span className="text-[9px] text-zinc-500">Scan at Cafe @7 Counter</span>
          </div>
        </div>

        {/* 4-Digit Pickup PIN */}
        <div className="bg-[#20202C] p-3 rounded-xl border border-white/5 mb-2">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider">4-Digit Counter Verification PIN</div>
          <div className="text-2xl font-black text-[#FFB347] font-mono tracking-widest">4921</div>
        </div>

        <div className="text-xs text-zinc-400">
          Target Break Slot: <strong className="text-white">11:50 AM – 12:10 PM</strong>
        </div>
      </div>

      {/* Handover Instructions */}
      <div className="p-4 rounded-2xl bg-[#16161E] border border-white/5 text-left text-xs text-zinc-400 space-y-2">
        <div className="font-bold text-white mb-1">⚡ Express Counter Collection:</div>
        <div>1. Head to the dedicated <strong className="text-white">FoodLine Counter</strong> at Cafe @7.</div>
        <div>2. Flash this screen to the counter scanner or tell PIN <strong className="text-[#FFB347]">4921</strong>.</div>
        <div>3. Collect your tray in under 30 seconds and enjoy your break!</div>
      </div>
    </div>
  );
}
"""

KDS_PAGE_TSX = """
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function KDSPage() {
  const [orders, setOrders] = useState([
    {
      id: 'FL-8492',
      slot: '11:50 AM (Slot A)',
      items: ['2x Masala Dosa', '1x Cold Coffee'],
      status: 'PREPARING',
      time: '2 mins ago'
    },
    {
      id: 'FL-8493',
      slot: '11:50 AM (Slot A)',
      items: ['1x Veg Cheese Grill Sandwich', '1x Peri Peri Fries'],
      status: 'PREPARING',
      time: '4 mins ago'
    },
    {
      id: 'FL-8494',
      slot: '12:10 PM (Slot B)',
      items: ['3x Vada Pav', '2x Special Tea'],
      status: 'QUEUED',
      time: '1 min ago'
    },
    {
      id: 'FL-8491',
      slot: '11:50 AM (Slot A)',
      items: ['1x Veg Fried Momo', '1x KitKat Shake'],
      status: 'READY',
      time: '6 mins ago'
    }
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white p-6">
      {/* Top Bar */}
      <header className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🍳</div>
          <div>
            <h1 className="text-xl font-black">Kitchen Display System (KDS)</h1>
            <p className="text-xs text-zinc-400">Cafe @7 • Real-Time Slot Batching</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full font-bold">
            ● SSE Live Sync Active
          </span>
          <Link href="/menu" className="text-xs bg-[#16161E] hover:bg-[#20202C] px-3 py-1.5 rounded-lg border border-white/10">
            Open Menu →
          </Link>
        </div>
      </header>

      {/* KDS Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: QUEUED */}
        <div className="p-4 rounded-2xl bg-[#16161E] border border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <span className="font-bold text-sm text-[#FFB347]">⏳ QUEUED (Incoming)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
              {orders.filter(o => o.status === 'QUEUED').length}
            </span>
          </div>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'QUEUED').map(o => (
              <div key={o.id} className="p-4 rounded-xl bg-[#20202C] border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-extrabold text-sm text-white">#{o.id}</span>
                  <span className="text-[11px] text-[#FFB347] font-semibold">{o.slot}</span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-1 mb-4">
                  {o.items.map((it, idx) => (
                    <li key={idx} className="font-medium">• {it}</li>
                  ))}
                </ul>
                <button
                  onClick={() => updateStatus(o.id, 'PREPARING')}
                  className="w-full py-2 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white font-bold text-xs rounded-lg transition"
                >
                  Start Preparing →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: PREPARING */}
        <div className="p-4 rounded-2xl bg-[#16161E] border border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <span className="font-bold text-sm text-[#00D4AA]">🔥 PREPARING (Cooking)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
              {orders.filter(o => o.status === 'PREPARING').length}
            </span>
          </div>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'PREPARING').map(o => (
              <div key={o.id} className="p-4 rounded-xl bg-[#20202C] border border-emerald-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-extrabold text-sm text-white">#{o.id}</span>
                  <span className="text-[11px] text-[#00D4AA] font-semibold">{o.slot}</span>
                </div>
                <ul className="text-xs text-zinc-200 space-y-1 mb-4">
                  {o.items.map((it, idx) => (
                    <li key={idx} className="font-medium">• {it}</li>
                  ))}
                </ul>
                <button
                  onClick={() => updateStatus(o.id, 'READY')}
                  className="w-full py-2 bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-black font-bold text-xs rounded-lg transition"
                >
                  Mark READY for Pickup ✔
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: READY FOR PICKUP */}
        <div className="p-4 rounded-2xl bg-[#16161E] border border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <span className="font-bold text-sm text-[#8B5CF6]">🎟️ READY AT EXPRESS COUNTER</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
              {orders.filter(o => o.status === 'READY').length}
            </span>
          </div>
          <div className="space-y-4">
            {orders.filter(o => o.status === 'READY').map(o => (
              <div key={o.id} className="p-4 rounded-xl bg-[#20202C] border border-purple-500/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono font-extrabold text-sm text-white">#{o.id}</span>
                  <span className="text-[11px] text-purple-400 font-semibold">{o.slot}</span>
                </div>
                <ul className="text-xs text-zinc-300 space-y-1 mb-4">
                  {o.items.map((it, idx) => (
                    <li key={idx}>• {it}</li>
                  ))}
                </ul>
                <button
                  onClick={() => updateStatus(o.id, 'COLLECTED')}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition"
                >
                  Confirm Handover (30s) ✨
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
"""

def main():
    print("Scaffolding FoodLine App into:", APP_DIR)
    
    # 1. Config & Project Root
    create_file("package.json", PACKAGE_JSON)
    create_file("tsconfig.json", TSCONFIG_JSON)
    create_file(".gitignore", GITIGNORE)
    create_file("README.md", README_MD)

    # 2. Data
    create_file(os.path.join("src", "data", "menu.json"), json.dumps(MENU_DATA, indent=2))
    create_file(os.path.join("src", "data", "campus.json"), json.dumps(CAMPUS_CONFIG, indent=2))

    # 3. Lib & Types
    create_file(os.path.join("src", "lib", "types.ts"), TYPES_TS)
    create_file(os.path.join("src", "lib", "utils.ts"), UTILS_TS)

    # 4. Styles
    create_file(os.path.join("src", "app", "globals.css"), GLOBALS_CSS)

    # 5. App Pages
    create_file(os.path.join("src", "app", "layout.tsx"), LAYOUT_TSX)
    create_file(os.path.join("src", "app", "page.tsx"), PAGE_TSX)
    create_file(os.path.join("src", "app", "menu", "page.tsx"), MENU_PAGE_TSX)
    create_file(os.path.join("src", "app", "checkout", "page.tsx"), CHECKOUT_PAGE_TSX)
    create_file(os.path.join("src", "app", "payment", "page.tsx"), PAYMENT_PAGE_TSX)
    create_file(os.path.join("src", "app", "order", "[token]", "page.tsx"), ORDER_STATUS_PAGE_TSX)
    create_file(os.path.join("src", "app", "kds", "page.tsx"), KDS_PAGE_TSX)

    print("Scaffolding complete!")

if __name__ == "__main__":
    main()
