import { UserRole } from '../types';
import { Permission, ROLE_PERMISSIONS } from './types';

export function hasPermission(role: UserRole | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function hasAnyPermission(role: UserRole | undefined | null, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.some((perm) => hasPermission(role, perm));
}

export function hasAllPermissions(role: UserRole | undefined | null, permissions: Permission[]): boolean {
  if (!role) return false;
  return permissions.every((perm) => hasPermission(role, perm));
}

export function canAccessRoute(role: UserRole | undefined | null, pathname: string): boolean {
  // Public routes always accessible
  if (
    pathname === '/' ||
    pathname === '/menu' ||
    pathname === '/display' ||
    pathname === '/login' ||
    pathname.startsWith('/auth')
  ) {
    return true;
  }

  if (!role) return false;

  if (pathname.startsWith('/kds')) {
    return role === 'kitchen' || role === 'canteen_manager' || role === 'admin';
  }

  if (pathname.startsWith('/admin')) {
    return role === 'canteen_manager' || role === 'admin';
  }

  if (pathname.startsWith('/checkout') || pathname.startsWith('/order')) {
    return true; // Any authenticated user
  }

  return true;
}
