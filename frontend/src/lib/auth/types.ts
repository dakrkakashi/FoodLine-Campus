export type { UserRole, UserProfile, StaffInvitation, AuditLog } from '../types';

export type Permission =
  | 'menu:browse'
  | 'menu:manage'
  | 'stock:update'
  | 'order:create'
  | 'order:view_own'
  | 'order:view_all'
  | 'order:update_status'
  | 'display:view'
  | 'display:manage'
  | 'admin:view'
  | 'admin:financials_all'
  | 'admin:financials_canteen'
  | 'admin:users_manage'
  | 'admin:audit_view'
  | 'slots:manage'
  | 'settlement:verify';

export const ROLE_PERMISSIONS: Record<import('../types').UserRole, Permission[]> = {
  student: [
    'menu:browse',
    'order:create',
    'order:view_own',
    'display:view',
  ],
  kitchen: [
    'menu:browse',
    'stock:update',
    'order:view_all',
    'order:update_status',
    'display:view',
  ],
  canteen_manager: [
    'menu:browse',
    'menu:manage',
    'stock:update',
    'order:view_all',
    'order:update_status',
    'display:view',
    'display:manage',
    'admin:view',
    'admin:financials_canteen',
    'slots:manage',
    'settlement:verify',
  ],
  admin: [
    'menu:browse',
    'menu:manage',
    'stock:update',
    'order:create',
    'order:view_own',
    'order:view_all',
    'order:update_status',
    'display:view',
    'display:manage',
    'admin:view',
    'admin:financials_all',
    'admin:financials_canteen',
    'admin:users_manage',
    'admin:audit_view',
    'slots:manage',
    'settlement:verify',
  ],
};

export const ROLE_DEFAULT_ROUTES: Record<import('../types').UserRole, string> = {
  student: '/menu',
  kitchen: '/kds',
  canteen_manager: '/admin',
  admin: '/admin',
};

export const ROLE_LABELS: Record<import('../types').UserRole, string> = {
  student: 'Campus Student',
  kitchen: 'Kitchen Chef & Staff',
  canteen_manager: 'Canteen Manager (Cafe @7)',
  admin: 'Executive Admin & Founder',
};
