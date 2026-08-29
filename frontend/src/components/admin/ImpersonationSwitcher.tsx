'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { UserRole } from '@/lib/types';
import { Eye, RotateCcw } from 'lucide-react';

export function ImpersonationSwitcher() {
  const { role, impersonatedRole, setImpersonatedRole } = useAuth();

  // Only real Admins can use impersonation
  if (role !== 'admin') return null;

  const roles: { value: UserRole | null; label: string }[] = [
    { value: null, label: '⚡ Real Admin (Founder)' },
    { value: 'canteen_manager', label: '🏪 Canteen Manager (96.6%)' },
    { value: 'kitchen', label: '👨‍🍳 Kitchen Staff' },
    { value: 'student', label: '🎓 Student' },
  ];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs">
      <div className="flex items-center gap-1.5 text-purple-300 font-medium">
        <Eye className="w-3.5 h-3.5 animate-pulse text-purple-400" />
        <span>View As:</span>
      </div>
      <select
        value={impersonatedRole || ''}
        onChange={(e) => setImpersonatedRole((e.target.value as UserRole) || null)}
        className="bg-black/60 border border-purple-500/40 text-purple-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
      >
        {roles.map((r) => (
          <option key={r.label} value={r.value || ''} className="bg-neutral-900 text-white">
            {r.label}
          </option>
        ))}
      </select>
      {impersonatedRole && (
        <button
          onClick={() => setImpersonatedRole(null)}
          title="Reset to Real Admin"
          className="p-1 text-purple-400 hover:text-white rounded hover:bg-purple-800/40 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
