'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/useAuth';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { ImpersonationSwitcher } from '@/components/admin/ImpersonationSwitcher';
import { User, LogIn, LogOut, Shield, ChevronDown } from 'lucide-react';

export function UserAvatar() {
  const { user, profile, effectiveRole, role, signOut, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse border border-white/10" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </Link>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user.email?.slice(0, 2).toUpperCase() || 'FL';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all focus:outline-none"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name || 'User'}
            className="w-7 h-7 rounded-lg object-cover border border-orange-500/40"
          />
        ) : (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white text-xs font-black flex items-center justify-center shadow-inner">
            {initials}
          </div>
        )}
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-semibold text-neutral-200 line-clamp-1 max-w-[120px]">
            {profile?.full_name || user.email?.split('@')[0]}
          </span>
          <span className="text-[10px] text-neutral-400 capitalize">
            {effectiveRole.replace('_', ' ')}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 p-3 rounded-2xl bg-neutral-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 animate-in fade-in zoom-in-95">
          {/* User Info Header */}
          <div className="pb-3 mb-2 border-b border-white/10 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white line-clamp-1">
                {profile?.full_name || 'Campus Student'}
              </h4>
              <p className="text-xs text-neutral-400 line-clamp-1">{user.email}</p>
              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                <RoleBadge role={effectiveRole} size="sm" />
                {role === 'admin' && effectiveRole !== 'admin' && (
                  <span className="text-[9px] text-purple-400 font-mono">(Impersonating)</span>
                )}
              </div>
            </div>
          </div>

          {/* Admin Impersonation Switcher */}
          {role === 'admin' && (
            <div className="py-2 mb-2 border-b border-white/10">
              <ImpersonationSwitcher />
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1 text-xs">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-white/10 transition-colors font-semibold bg-white/5 border border-white/5"
            >
              <User className="w-4 h-4 text-[#00D4AA]" />
              <span>My Account & Profile</span>
            </Link>

            {(effectiveRole === 'canteen_manager' || effectiveRole === 'admin') && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Executive Manager Hub</span>
              </Link>
            )}

            {(effectiveRole === 'kitchen' || effectiveRole === 'canteen_manager' || effectiveRole === 'admin') && (
              <Link
                href="/kds"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Kitchen Display (KDS)</span>
              </Link>
            )}

            <Link
              href="/menu"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/5 transition-colors font-medium"
            >
              <span className="text-orange-400">🍔</span>
              <span>Student Menu</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="pt-2 mt-2 border-t border-white/10">
            <button
              onClick={async () => {
                setIsOpen(false);
                await signOut();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
