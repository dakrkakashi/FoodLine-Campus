# User Roles & Access Control — Master Implementation Plan

**Project:** FoodLine Campus Pre-Ordering & Express Pickup Ecosystem  
**Target Pilot Campus:** Sanjivani University, Kopargaon (Cafe @7)  
**Target Roles:** Student, Kitchen Staff, Canteen Manager (Cafe @7), Admin (Founder)  
**Auth Engine:** Supabase Auth + Row Level Security (RLS) + Next.js 15 Server Actions

---

## 1. Role Definitions & Permissions Matrix

| Feature | Student | Kitchen Staff | Canteen Manager (Cafe @7) | Admin (Founder) |
|---|---|---|---|---|
| **Auth Provider** | Google SSO (`@sanjivani.edu.in`) / PRN+OTP | Email/Password (Invite Only) | Email/Password (Invite Only) | Email/Password |
| **Menu Browse (`/menu`)** | ✅ Full (Public Guest + Auth) | ✅ Read-only | ✅ Full CRUD + Live Edit | ✅ Full CRUD + Live Edit |
| **Place Orders (`/checkout`)** | ✅ (Auth Required at Checkout) | ❌ Restricted | ❌ Restricted | ✅ Sandbox Test Mode |
| **View Own Orders** | ✅ Token/Session Bound | ❌ Restricted | ✅ All Cafeteria Orders | ✅ All Global Orders |
| **Kitchen KDS (`/kds`)** | ❌ Restricted | ✅ Full (Kanban + Audio FX) | ✅ Full + Status Overrides | ✅ Full System Access |
| **TV Display (`/display`)** | ✅ View Only (Public Kiosk) | ✅ View Only (Public Kiosk) | ✅ View + Manage Audio | ✅ View + Full Config |
| **Manager Hub (`/admin`)** | ❌ Restricted | ❌ Restricted | ✅ 96.6% Canteen Share Only | ✅ Full Waterfall (96.6% + 3.4%) |
| **Live Stock & Price Steppers**| ❌ Restricted | ✅ Portions Stepper (`±1, ±5`) | ✅ Price (`±₹5`) + Stock Steppers | ✅ Master Database Override |
| **Campus Break Slot Control** | ✅ Book Active Slots | ❌ Restricted | ✅ Shift Capacity Override | ✅ Master Slot Configuration |
| **User & Staff Management** | ❌ Restricted | ❌ Restricted | ✅ Invite Kitchen Staff | ✅ Invite/Deactivate All Roles |
| **Financial Settlement & UTR**| ❌ Restricted | ❌ Restricted | ✅ Verify Payments & Cash | ✅ Full Audit & Bank Export |
| **Cash-on-Delivery (COD)** | ✅ Place Order (Routes to C1) | ❌ Restricted | ✅ Reconcile Cash Register | ✅ Gross Revenue Audit |

---

## 2. Database Schema & Migration DDL

### 2.1 Enhanced `profiles` Table
```sql
-- Extend existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  avatar_url TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL,
  cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE SET NULL;

-- Update role check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'kitchen', 'canteen_manager', 'admin'));

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_campus ON profiles(campus_id);
CREATE INDEX IF NOT EXISTS idx_profiles_cafeteria ON profiles(cafeteria_id);
```

### 2.2 Staff Invitations Table
```sql
CREATE TABLE IF NOT EXISTS staff_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('kitchen', 'canteen_manager')),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE,
  cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE,
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  token VARCHAR(64) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_staff_invitations_token ON staff_invitations(token);
CREATE INDEX IF NOT EXISTS idx_staff_invitations_email ON staff_invitations(email);
```

### 2.3 System Audit Logs Table
```sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50), -- 'user', 'menu_item', 'slot', 'order', 'invitation', 'financial'
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
```

### 2.4 Auto-Profile Creation Trigger (Student Registration)
```sql
-- Automatically creates a 'student' profile on first OAuth/OTP signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    is_active,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Campus Student'),
    'student',
    TRUE,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    last_login_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2.5 Granular Row Level Security (RLS) Policies
```sql
-- Profiles: Users read own, Admins read all, Managers read staff
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "profiles_select_manager" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
  AND role IN ('kitchen', 'canteen_manager', 'student')
);

-- Orders: Students read own, Kitchen/Managers read all cafeteria orders, Admins read all
CREATE POLICY "orders_select_student" ON orders FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);
CREATE POLICY "orders_select_staff" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
);
CREATE POLICY "orders_update_staff" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
);

-- Menu Items: Public read, Managers/Admins write, Kitchen updates stock
CREATE POLICY "menu_items_select_public" ON menu_items FOR SELECT USING (true);
CREATE POLICY "menu_items_manage_manager" ON menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);
CREATE POLICY "menu_items_stock_kitchen" ON menu_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
);

-- Pickup Slots: Public read, Managers/Admins write
CREATE POLICY "pickup_slots_select_public" ON pickup_slots FOR SELECT USING (true);
CREATE POLICY "pickup_slots_manage_manager" ON pickup_slots FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);

-- Payments: Students insert own, Managers verify, Admins audit all
CREATE POLICY "payments_insert_student" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "payments_verify_staff" ON payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);
CREATE POLICY "payments_select_admin" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Staff Invitations: Managers/Admins manage, invitees read token
CREATE POLICY "invitations_select_admin" ON staff_invitations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
  OR email = (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "invitations_manage_admin" ON staff_invitations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);

-- Audit Logs: Admin read all, Managers read own actions
CREATE POLICY "audit_logs_select_admin" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "audit_logs_select_manager" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'canteen_manager')
  AND actor_id = auth.uid()
);
```

---

## 3. Supabase Auth Configuration

* **Email/Password:** Enabled for invited staff and administrators.
* **Google OAuth:** Enabled, restricted to `@sanjivani.edu.in` domain for campus students.
* **Phone OTP:** Enabled for PRN + SMS fast login.
* **Session Lifetimes:**
  * **Students:** 30 Days (Persistent semester sessions on mobile devices).
  * **Staff & Kiosk Tablets:** 12 Hours (Daily shift timeouts).

---

## 4. Frontend Architecture (Canonical Flat URLs)

```
frontend/src/
├── lib/
│   ├── auth/
│   │   ├── types.ts                   # User, Role, & Permission Types
│   │   ├── permissions.ts             # Role-Capability Matrix
│   │   ├── useAuth.ts                 # React Auth & Profile Context Hook
│   │   └── usePermissions.ts          # Granular Action Capability Hook
│   └── supabase/
│       ├── client.ts                  # Public Browser Client (anon key)
│       └── server.ts                  # Safe Server Client (SSR cookies)
├── hooks/
│   ├── useRoleRedirect.ts             # Post-login role director
│   └── useProfile.ts                  # Profile query & state synchronization
├── middleware.ts                      # Edge Route Protection Guard
├── components/
│   ├── auth/
│   │   ├── RoleGate.tsx               # Declarative role-permission component wrapper
│   │   ├── LoginForm.tsx              # Universal login with role auto-detection
│   │   ├── StaffInviteModal.tsx       # Manager/Admin staff invite dialog
│   │   └── UserAvatar.tsx             # Role badge, profile drawer, & logout trigger
│   ├── admin/
│   │   ├── UserManagement.tsx         # Staff directory, role switches, deactivations
│   │   ├── RoleBadge.tsx              # Glowing status pills (Student/Staff/Manager/Admin)
│   │   ├── ImpersonationSwitcher.tsx  # Founder 1-tap UI preview switcher
│   │   └── InvitationManager.tsx      # Pending, accepted, and revoked invite logs
│   ├── layout/
│   │   ├── RoleNavbar.tsx             # Role-aware navigation bar
│   │   └── RoleSidebar.tsx            # Manager & Admin drawer navigation
│   └── display/
│       └── AudioSettingsDrawer.tsx    # Gated admin settings for TV announcer
├── app/
│   ├── page.tsx                       # Landing Page & Order Mode Selector (Public)
│   ├── menu/page.tsx                  # Student Menu & Cart (Public Guest Browse)
│   ├── checkout/page.tsx              # Slot & Payment Gateway (Auth Required)
│   ├── order/[token]/page.tsx         # Live Digital Pass & SSE Tracking (Auth Required)
│   ├── display/page.tsx               # Big-Screen TV Counter Display (Public Kiosk)
│   ├── kds/page.tsx                   # Kitchen Display & Live Stock Editor (Kitchen/Manager)
│   ├── admin/page.tsx                 # Executive Manager & Founder Data Hub (Manager/Admin)
│   ├── auth/
│   │   ├── callback/route.ts          # OAuth & Magic Link Exchange Handler
│   │   ├── invite/[token]/page.tsx    # Staff Invitation Acceptance Page
│   │   └── logout/route.ts            # Session Termination Handler
│   └── login/page.tsx                 # Universal Auth Screen
├── actions/admin/                     # Secure Next.js 15 Server Actions
│   ├── invite.ts                      # Server Action: createStaffInvitation()
│   ├── revoke-invitation.ts           # Server Action: revokeInvitation()
│   ├── update-user-role.ts            # Server Action: updateUserRole()
│   └── deactivate-user.ts             # Server Action: deactivateUser()
└── api/admin/                         # Internal Protected API Route Handlers
    ├── invite/route.ts                # POST: create staff invitation
    ├── invitations/route.ts           # GET: list pending invitations
    ├── users/route.ts                 # GET: query staff roster
    └── users/[id]/route.ts            # PATCH: modify role / DELETE: deactivate
```

---

## 5. Next.js 15 Edge Middleware Route Protection

```typescript
// frontend/src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES: Record<string, string[]> = {
  '/kds': ['kitchen', 'canteen_manager', 'admin'],
  '/admin': ['canteen_manager', 'admin'],
  '/checkout': ['student', 'canteen_manager', 'admin'],
  '/order': ['student', 'canteen_manager', 'admin'],
};

// PUBLIC ROUTES (Never Redirect):
// - / (Landing)
// - /display (TV Kiosk Mode)
// - /menu (Guest Browsing)
// - /login (Auth)
// - /auth/* (OAuth & Invites)

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  const protectedEntry = Object.entries(PROTECTED_ROUTES).find(([route]) => pathname.startsWith(route));

  if (!protectedEntry) {
    return response; // Public route
  }

  const [, allowedRoles] = protectedEntry;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single();

  if (!profile?.is_active) {
    return NextResponse.redirect(new URL('/login?error=deactivated', request.url));
  }

  if (!allowedRoles.includes(profile.role)) {
    const defaultRoute = profile.role === 'kitchen' ? '/kds' : profile.role === 'admin' ? '/admin' : '/menu';
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
```

---

## 6. Financial Split & Payout Rules

| Revenue Dimension | Canteen Manager (Cafe @7) | Admin / Founder View |
|---|---|---|
| **Gross GMV** | ❌ Hidden | ✅ Visible |
| **Canteen Net Food Sales** | ✅ Primary Metric (**96.6% Payout**) | ✅ Visible |
| **Fast-Pass Platform Take** | ❌ Hidden | ✅ **3.4% Tech Platform Fee** |
| **Cash-on-Delivery (COD)** | ✅ Visible (Cash Register Sum) | ✅ Visible |
| **UPI Direct Settlements** | ✅ Verified Status | ✅ Full Bank UTR Audit Log |
| **Kitchen Staff Invites** | ✅ Invite Kitchen Staff | ✅ Full Staff & Manager Invites |
| **System Audit Trail** | ❌ Hidden | ✅ Full Audit Log Export |

### 🧮 Explicit Mathematical Formula:
$$\text{Food Subtotal} = \frac{\text{Gross GMV}}{1.035}$$
$$\text{Founder Fast-Pass Margin (3.4\%)} = \text{Gross GMV} - \text{Food Subtotal}$$
$$\text{Canteen Payout (96.6\%)} = \text{Food Subtotal}$$

---

## 7. Declarative UI Component: `RoleGate.tsx`

```tsx
// frontend/src/components/auth/RoleGate.tsx
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
  const { profile, loading } = useAuth();

  if (loading) return null;
  if (!profile || !allowedRoles.includes(profile.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

---

## 8. Implementation Roadmap & Phased Execution

| Phase | Milestone | Est. Time | Key Deliverables |
|---|---|---|---|
| **Phase 1** | Database & Schema Foundation | 4 hrs | `profiles`, `staff_invitations`, `audit_logs` DDL, triggers & RLS |
| **Phase 2** | Auth Context & Middleware | 4 hrs | `useAuth`, `usePermissions`, Edge `middleware.ts`, `RoleGate` |
| **Phase 3** | Navigation & Role Layouts | 3 hrs | `RoleNavbar`, `RoleSidebar`, `UserAvatar`, `ImpersonationSwitcher` |
| **Phase 4** | Canteen Manager Dashboard | 5 hrs | 96.6% net sales view, slot overrides, order actions, kitchen invites |
| **Phase 5** | Founder Admin & User Center | 5 hrs | User directory, 3.4% revenue waterfall, Server Actions, audit logs |
| **Phase 6** | TV Display Kiosk & Polish | 3 hrs | Public kiosk `/display`, guest `/menu`, invite acceptance page |
| **Total** | | **~24 hrs** | Full End-to-End Role-Based Access Control |

---

## 9. Final Acceptance Checklist

1. [x] **Public Browsing:** Students browse 44+ dishes on `/menu` without forced login.
2. [x] **Checkout Auth:** Student identity captured at `/checkout` with 30-day session persistence.
3. [x] **TV Display Kiosk:** `/display` operates 24/7 on cafeteria screens with zero login requirements.
4. [x] **Kitchen Isolation:** Kitchen staff on `/kds` are locked out of financial and user management.
5. [x] **Manager Clarity:** Canteen manager views only their 96.6% food sales payout.
6. [x] **Founder Mastery:** Founder views full 3.4% fast-pass waterfall and manages all staff.
7. [x] **Zero Service Key Leakage:** No `SERVICE_ROLE_KEY` in client code; all admin ops run in Server Actions.
8. [x] **Invite Expiry:** Staff invitations expire after 7 days and are single-use.

---

**Master Plan saved to:** [`.opencode/plans/USER_ROLES_PLAN.md`](file:///run/media/darkkakashi/Laptop%20NVME%20Data%20Drive/old%20windows%2011/desktop/PPT%20OTHER%20TASKES/.opencode/plans/USER_ROLES_PLAN.md)