'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { UserRole } from '@/lib/types';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { effectiveRole, loading } = useAuth();

  if (loading) return null;

  if (!allowedRoles.includes(effectiveRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
