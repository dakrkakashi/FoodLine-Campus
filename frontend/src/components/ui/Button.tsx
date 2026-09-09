'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-tight rounded-2xl transition duration-150 active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 min-h-[36px]',
    md: 'px-5 py-2.5 text-sm gap-2 min-h-[44px]',
    lg: 'px-7 py-3.5 text-base gap-2.5 min-h-[52px]',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#FF6B2C] via-[#FF8A3D] to-[#FFB347] text-black shadow-lg shadow-[#FF6B2C]/25 hover:shadow-[#FF6B2C]/40 hover:brightness-105',
    secondary: 'bg-[#00D4AA] text-black shadow-lg shadow-[#00D4AA]/25 hover:brightness-105',
    glass: 'bg-[#16161E]/80 backdrop-blur-xl border border-white/15 text-white hover:bg-[#20202E] hover:border-white/30 shadow-md',
    danger: 'bg-red-600/90 text-white hover:bg-red-500 shadow-lg shadow-red-600/20',
    ghost: 'bg-transparent text-zinc-300 hover:text-white hover:bg-white/10',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
