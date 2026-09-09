'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Plus, Check, Flame, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSoundFX } from '@/hooks/useSoundFX';
import { fireConfettiSuccess } from '@/components/ui';

interface ComboBundle {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  price: number;
  originalPrice: number;
  savings: number;
  icon: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
  }[];
}

const CAMPUS_COMBOS: ComboBundle[] = [
  {
    id: 'combo-sanjivani-classic',
    name: 'Sanjivani Classic',
    tagline: 'Special Vada Pav + Hot Cutting Chai',
    badge: '10:45 AM Bestseller',
    price: 30,
    originalPrice: 35,
    savings: 5,
    icon: '🥪',
    items: [
      { id: 'dish-vada-pav', name: 'Special Vada Pav', price: 20, quantity: 1, category: 'Quick Bites & Chaat' },
      { id: 'dish-cutting-chai', name: 'Cutting Chai', price: 10, quantity: 1, category: 'Beverages & Desserts' },
    ],
  },
  {
    id: 'combo-power-dosa',
    name: 'Recess Power Dosa',
    tagline: 'Crispy Masala Dosa + South Filter Coffee',
    badge: 'Chef Special',
    price: 75,
    originalPrice: 85,
    savings: 10,
    icon: '🥞',
    items: [
      { id: 'dish-masala-dosa', name: 'Mysore Masala Dosa', price: 55, quantity: 1, category: 'South & North Indian' },
      { id: 'dish-filter-coffee', name: 'South Filter Coffee', price: 20, quantity: 1, category: 'Beverages & Desserts' },
    ],
  },
  {
    id: 'combo-all-nighter',
    name: 'Hostel All-Nighter',
    tagline: 'Cheese Maggi + Chilled Thick Cold Coffee',
    badge: 'Save ₹15',
    price: 95,
    originalPrice: 110,
    savings: 15,
    icon: '🍜',
    items: [
      { id: 'dish-cheese-maggi', name: 'Loaded Cheese Maggi', price: 55, quantity: 1, category: 'Maggi, Chinese & Rice' },
      { id: 'dish-cold-coffee', name: 'Thick Cold Coffee', price: 40, quantity: 1, category: 'Beverages & Desserts' },
    ],
  },
];

export function CampusCombosBar() {
  const { addItem } = useCart();
  const { playSuccess, playClick } = useSoundFX();
  const [addedComboId, setAddedComboId] = useState<string | null>(null);

  const handleAddCombo = (combo: ComboBundle) => {
    playClick();
    combo.items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
      });
    });

    playSuccess();
    fireConfettiSuccess();

    setAddedComboId(combo.id);
    setTimeout(() => {
      setAddedComboId(null);
    }, 2000);
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-accent-orange/15 border border-accent-orange/30 text-accent-amber flex items-center justify-center">
            <Flame size={18} className="text-accent-orange fill-accent-orange" />
          </div>
          <div>
            <h3 className="text-base font-black text-(--text-primary) uppercase tracking-wide">
              Sanjivani Value Combos
            </h3>
            <p className="text-xs text-(--text-secondary) font-medium">
              Curated student pairs • 1-Tap bundled savings
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black">
          <Sparkles size={12} />
          <span>Save up to ₹15</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CAMPUS_COMBOS.map((combo) => {
          const isAdded = addedComboId === combo.id;

          return (
            <motion.div
              key={combo.id}
              whileHover={{ y: -3 }}
              className="p-5 rounded-3xl bg-(--bg-card) border border-(--border-glass) backdrop-blur-xl shadow-lg hover:border-accent-orange/40 transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-accent-orange/15 border border-accent-orange/30 text-[10px] font-black text-accent-amber uppercase tracking-wider">
                  {combo.badge}
                </span>
                <span className="text-2xl">{combo.icon}</span>
              </div>

              <div>
                <h4 className="text-base font-black text-(--text-primary) tracking-tight">
                  {combo.name}
                </h4>
                <p className="text-xs text-(--text-secondary) font-medium mt-0.5 mb-3 leading-snug">
                  {combo.tagline}
                </p>
              </div>

              <div className="pt-3 border-t border-(--border-glass) flex items-center justify-between mt-auto">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-accent-teal font-mono">
                      ₹{combo.price}
                    </span>
                    <span className="text-xs text-(--text-muted) line-through font-mono">
                      ₹{combo.originalPrice}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Save ₹{combo.savings}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddCombo(combo)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-md ${
                    isAdded
                      ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                      : 'bg-linear-to-r from-accent-orange to-accent-amber text-black shadow-accent-orange/20 hover:brightness-105'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={14} className="stroke-[3]" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} className="stroke-[3]" />
                      <span>Add Combo</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
