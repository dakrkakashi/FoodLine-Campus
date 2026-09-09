import React from 'react';
import { UserRole } from '@/lib/types';
import { Shield, ChefHat, Store, GraduationCap } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md';
}

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const configs: Record<UserRole, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    student: {
      label: 'Student',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      icon: <GraduationCap className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
    },
    kitchen: {
      label: 'Kitchen Staff',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: <ChefHat className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
    },
    canteen_manager: {
      label: 'Canteen Manager',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: <Store className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
    },
    admin: {
      label: 'Founder & Admin',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      icon: <Shield className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />,
    },
  };

  const config = configs[role] || configs.student;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border ${config.bg} ${config.text} ${config.border} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
