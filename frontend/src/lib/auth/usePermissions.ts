'use client';

import { useAuth } from './useAuth';
import { Permission } from './types';
import { hasPermission, hasAnyPermission, hasAllPermissions } from './permissions';

export function usePermissions() {
  const { effectiveRole, role, loading } = useAuth();

  return {
    role,
    effectiveRole,
    loading,
    can: (permission: Permission) => hasPermission(effectiveRole, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(effectiveRole, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(effectiveRole, permissions),
    isStudent: effectiveRole === 'student',
    isKitchen: effectiveRole === 'kitchen',
    isManager: effectiveRole === 'canteen_manager',
    isAdmin: effectiveRole === 'admin',
    isStaffOrAbove: effectiveRole === 'kitchen' || effectiveRole === 'canteen_manager' || effectiveRole === 'admin',
    isManagerOrAbove: effectiveRole === 'canteen_manager' || effectiveRole === 'admin',
  };
}
