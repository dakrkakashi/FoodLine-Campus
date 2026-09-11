'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Receipt,
  Trash2,
  Sparkles,
  ShieldCheck,
  Clock,
  Store,
  Leaf,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Plus,
  Minus,
  Utensils,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useCart } from '@/context/CartContext';
import { useInventory } from '@/context/InventoryContext';
import { useCampus } from '@/context/CampusContext';
import { useSoundFX } from '@/hooks/useSoundFX';
import { PageTransition, SpotlightCard, Magnetic, AnimatedCounter } from '@/components/ui';
import { EmptyCartIllustration } from '@/components/illustrations';
import { formatINR } from '@/lib/utils';
import { VegIcon } from '@/components/icons';

export default function CartReviewPage() {
  const router = useRouter();
  const { items, totalAmount, totalCount, addItem, removeItem, deleteItem, updateQuantity, clearCart } = useCart();
  const { getEffectiveAvailability, getStockQuantity } = useInventory();
  const { selectedCampus, selectedCanteen } = useCampus();
  const { playClick, playPop, playSuccess } = useSoundFX();

  const [cookingNotes, setCookingNotes] = useState('');
  const [ecoCutlery, setEcoCutlery] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const unavailableItems = items.filter((item) => !getEffectiveAvailability(item));

  if (items.length === 0) {
    return (
      <PageTransition className="min-h-screen bg-(--bg-canvas) text-(--text-primary) pb-24 transition-colors duration-500">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 pt-16 sm:pt-24 text-center">
          <SpotlightCard className="p-8 sm:p-12 rounded-[2.5rem] text-center border-dashed border-(--border-glass)">
            <EmptyCartIllustration size={190} className="mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-black text-(--text-primary) mb-2">
              Your Food Tray is Empty
            </h1>
            <p className="text-xs sm:text-sm text-(--text-secondary) mb-8 max-w-sm mx-auto leading-relaxed">
              Explore freshly made campus dishes from {selectedCanteen?.name || 'Cafe @ 7'} and pre-order to skip the 25-minute break line.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/menu" className="w-full sm:w-auto">
                <Magnetic strength={0.2}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={playClick}
                    className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-2xl bg-linear-to-r from-accent-orange to-accent-amber text-black font-black text-sm shadow-xl shadow-accent-orange/30 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Utensils size={16} />
                    <span>Explore Campus Menu</span>
                  </motion.button>
                </Magnetic>
              </Link>
              <Link href="/orders" className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={playClick}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-(--text-secondary) hover:text-(--text-primary) font-bold text-xs border border-(--border-glass) transition cursor-pointer"
                >
                  View Past Orders
                </button>
              </Link>
            </div>
          </SpotlightCard>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-(--bg-canvas) text-(--text-primary) pb-44 sm:pb-32 transition-colors duration-500">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/menu"
            onClick={playClick}
            className="inline-flex items-center gap-2 text-xs font-bold text-(--text-secondary) hover:text-(--text-primary) transition px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-(--border-glass) min-h-[44px] cursor-pointer"
            aria-label="Return to menu to add more items"
          >
            <ArrowLeft size={16} />
            <span>Add More Items</span>
          </Link>

          {/* Quick Clear Tray */}
          <button
            type="button"
            onClick={() => {
              playClick();
              if (window.confirm('Are you sure you want to empty your entire tray?')) {
                clearCart();
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400 transition px-3 py-2 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 min-h-[44px] cursor-pointer"
            aria-label="Clear all items from tray"
          >
            <Trash2 size={14} />
            <span>Clear Tray</span>
          </button>
        </div>

        {/* Unavailable Stock Warning */}
        <AnimatePresence>
          {unavailableItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-800 dark:text-red-200 text-xs sm:text-sm font-bold mb-6 space-y-2 shadow-sm"
              role="alert"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="text-red-500 shrink-0" />
                  <span>{unavailableItems.length} item{unavailableItems.length > 1 ? 's are' : ' is'} currently sold out:</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    for (const un of unavailableItems) deleteItem(un.id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-700 dark:text-red-200 text-xs font-black transition border border-red-500/30 cursor-pointer min-h-[36px]"
                >
                  Remove Sold Out
                </button>
              </div>
              <ul className="pl-6 list-disc text-xs text-red-700/90 dark:text-red-300/90">
                {unavailableItems.map((u) => (
                  <li key={u.id}>{u.name} (Sold Out)</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Tray Items List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <SpotlightCard className="p-4 sm:p-6 md:p-7 rounded-3xl">
              <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-(--border-glass)">
                <div className="flex items-center gap-2.5">
                  <Receipt size={22} className="text-accent-orange" />
                  <div>
                    <h1 className="text-lg sm:text-xl font-black text-(--text-primary)">
                      Review Your Campus Tray
                    </h1>
                    <p className="text-[11px] text-(--text-secondary) font-medium">
                      Pickup at {selectedCanteen?.name || 'Cafe @ 7'} \u2022 Express Counter
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-accent-amber bg-accent-orange/10 border border-accent-orange/25 px-3 py-1.5 rounded-full">
                  {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 divide-y divide-(--border-glass)">
                {items.map((item) => {
                  const stockQty = getStockQuantity(item.id);
                  const isMaxReached = stockQty !== null && stockQty !== undefined && item.quantity >= stockQty;
                  const itemSubtotal = item.price * item.quantity;

                  return (
                    <motion.div
                      layout
                      key={item.id}
                      className="pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <div className="mt-1 p-1 rounded-md bg-emerald-950/20 border border-emerald-500/20 shrink-0">
                          <VegIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-extrabold text-(--text-primary) truncate">
                              {item.name}
                            </h3>
                            {item.tag && (
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-orange/10 text-accent-amber border border-accent-orange/20 shrink-0">
                                {item.tag}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-(--text-secondary)">
                              {formatINR(item.price)} each
                            </span>
                            {stockQty !== null && stockQty !== undefined && stockQty <= 5 && (
                              <span className="text-[10px] font-extrabold text-accent-amber">
                                ({stockQty} left in kitchen)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stepper with accessible >=44px touch targets */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0">
                        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-(--border-glass) rounded-2xl p-1 shadow-xs">
                          <button
                            type="button"
                            onClick={() => {
                              playClick();
                              removeItem(item.id);
                            }}
                            className="w-9 h-9 min-w-[36px] rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-(--text-primary) font-black text-sm flex items-center justify-center transition active:scale-90 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden"
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            className="w-7 text-center font-black font-mono text-sm text-accent-amber"
                            aria-label={`Quantity: ${item.quantity}`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={isMaxReached}
                            onClick={() => {
                              if (!isMaxReached) {
                                playPop();
                                addItem({
                                  id: item.id,
                                  name: item.name,
                                  price: item.price,
                                  category: item.category,
                                  tag: item.tag,
                                  maxStock: stockQty,
                                });
                              }
                            }}
                            className={`w-9 h-9 min-w-[36px] rounded-xl font-black text-sm flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-accent-orange focus-visible:outline-hidden ${
                              isMaxReached
                                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-40 shadow-none'
                                : 'bg-accent-orange hover:brightness-110 text-black shadow-md shadow-accent-orange/30 cursor-pointer active:scale-90'
                            }`}
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right min-w-[70px]">
                          <span className="text-sm sm:text-base font-black text-(--text-primary) font-mono">
                            {formatINR(itemSubtotal)}
                          </span>
                        </div>

                        {/* Trash button */}
                        <button
                          type="button"
                          onClick={() => {
                            playClick();
                            deleteItem(item.id);
                          }}
                          className="p-2 rounded-xl text-(--text-muted) hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-hidden"
                          aria-label={`Remove ${item.name} from tray`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </SpotlightCard>

            {/* Kitchen Preparation Notes & Preferences Card */}
            <SpotlightCard className="p-4 sm:p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-black text-(--text-primary)">
                <MessageSquare size={18} className="text-accent-teal" />
                <span>Special Instructions for Canteen Chef</span>
              </div>
              <textarea
                value={cookingNotes}
                onChange={(e) => setCookingNotes(e.target.value)}
                placeholder="e.g. Less spicy, extra green chutney, no onions..."
                maxLength={180}
                rows={2}
                className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-black/30 border border-(--border-glass) text-xs sm:text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:border-accent-teal focus:ring-1 focus:ring-accent-teal outline-hidden transition resize-none"
                aria-label="Chef cooking instructions"
              />

              {/* Eco-Friendly Cutlery Toggle */}
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/10 transition">
                <input
                  type="checkbox"
                  checked={ecoCutlery}
                  onChange={(e) => setEcoCutlery(e.target.checked)}
                  className="w-4 h-4 rounded-md accent-emerald-500 cursor-pointer"
                />
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Leaf size={16} />
                  <span>Opt for Green Campus: Skip single-use plastic cutlery</span>
                </div>
              </label>
            </SpotlightCard>
          </div>

          {/* Right Column: Bill Breakdown & Next Step (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <SpotlightCard className="p-5 sm:p-6 rounded-3xl sticky top-24 border-accent-orange/30">
              <div className="flex items-center justify-between pb-4 border-b border-(--border-glass)">
                <h2 className="text-base sm:text-lg font-black text-(--text-primary)">
                  Bill Summary
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  Direct Canteen Price
                </span>
              </div>

              {/* Breakdown Rows */}
              <div className="py-4 space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-(--text-secondary)">
                  <span>Tray Items Subtotal</span>
                  <span className="font-mono font-bold text-(--text-primary)">
                    {formatINR(totalAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-(--text-secondary)">
                  <div className="flex items-center gap-1.5">
                    <span>Campus Technology Fee</span>
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                      0% FREE
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">₹0</span>
                </div>

                <div className="flex items-center justify-between text-(--text-secondary)">
                  <span>Taxes & Canteen Cess</span>
                  <span className="font-mono font-bold text-(--text-muted)">Included</span>
                </div>

                <div className="pt-3 border-t border-(--border-glass) flex items-center justify-between text-base sm:text-lg font-black text-(--text-primary)">
                  <span>Grand Total</span>
                  <span className="text-xl sm:text-2xl font-mono text-accent-amber">
                    <AnimatedCounter value={totalAmount} prefix="₹" />
                  </span>
                </div>
              </div>

              {/* Student Trust Guarantee */}
              <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-(--border-glass) flex items-center gap-2.5 text-[11px] text-(--text-secondary) mb-5">
                <ShieldCheck size={18} className="text-accent-teal shrink-0" />
                <span>Zero markup guarantee: 100% of order value goes directly to campus canteen.</span>
              </div>

              {/* Next Step Action: Proceed to Slot Selection */}
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  onClick={playSuccess}
                  className="w-full flex items-center justify-center gap-2.5 min-h-[52px] px-6 py-4 rounded-2xl bg-linear-to-r from-accent-orange via-accent-amber to-accent-amber text-black font-black text-sm sm:text-base shadow-xl shadow-accent-orange/30 hover:brightness-105 active:scale-[0.98] transition cursor-pointer"
                  aria-label={`Proceed to pickup slot and checkout with grand total ${formatINR(totalAmount)}`}
                >
                  <span>Proceed to Slot & Pickup</span>
                  <ArrowRight size={18} />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[11px] text-(--text-muted) font-medium">
                  <Clock size={13} className="text-accent-amber" />
                  <span>Next: Choose your 10-minute break pickup slot</span>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </main>

      {/* Floating Sticky Mobile Bottom Bar (visible on mobile screens) */}
      <div className="md:hidden fixed bottom-[68px] inset-x-0 z-40 px-4 pointer-events-none pb-[env(safe-area-inset-bottom)]">
        <div className="pointer-events-auto max-w-md mx-auto rounded-2xl bg-(--bg-card)/95 backdrop-blur-2xl border border-accent-orange/50 shadow-2xl p-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-black text-(--text-muted) tracking-wider">
              {totalCount} {totalCount === 1 ? 'Dish' : 'Dishes'}
            </div>
            <div className="text-lg font-black text-accent-amber font-mono">
              {formatINR(totalAmount)}
            </div>
          </div>

          <Link
            href="/checkout"
            onClick={playSuccess}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-accent-orange to-accent-amber text-black font-black text-xs shadow-lg shadow-accent-orange/25 cursor-pointer min-h-[44px]"
            aria-label="Proceed to checkout"
          >
            <span>Choose Slot</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
