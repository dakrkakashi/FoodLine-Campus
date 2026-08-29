# User Roles & Access Control — Implementation Plan (Corrected)

**Project:** FoodLine Campus Pre-Ordering System  
**Target Roles:** Student, Canteen Manager, Kitchen Staff, Admin (Founder)  
**Auth:** Supabase Auth + Row Level Security (RLS)

---

## 1. Role Definitions & Permissions Matrix

| Feature | Student | Kitchen Staff | Canteen Manager | Admin (Founder) |
|---|---|---|---|---|
| **Auth** | Google SSO (`@sanjivani.edu.in`) / PRN+OTP | Email/Password (invite only) | Email/Password (invite only) | Email/Password |
| **Menu Browse** | ✅ Full (Guest + Auth) | ✅ Read-only | ✅ Full CRUD | ✅ Full CRUD |
| **Place Orders** | ✅ (Auth required at checkout) | ❌ | ❌ | ✅ (Sandbox Mode) |
| **View Own Orders** | ✅ | ❌ | ✅ All | ✅ All |
| **KDS (Kitchen)** | ❌ | ✅ Full (kanban) | ✅ Full + override | ✅ Full |
| **Counter Display (`/display`)** | ❌ | ✅ View (Public Kiosk) | ✅ View + manage | ✅ View |
| **Admin Dashboard** | ❌ | ❌ | ✅ Full | ✅ Full + financial split |
| **Menu Management** | ❌ | ❌ Stock toggle only | ✅ CRUD + pricing | ✅ CRUD + pricing |
| **Slot Management** | ❌ | ❌ | ✅ CRUD | ✅ CRUD |
| **User Management** | ❌ | ❌ | ❌ | ✅ Invite/remove staff |
| **Financial Reports** | ❌ | ❌ | ✅ Canteen income (96.6%) | ✅ All (split view) |
| **Settlement/UTR** | ❌ | ❌ | ✅ Verify UTR | ✅ Full audit |
| **COD Orders** | ✅ Place | ❌ | ✅ Collect cash | ✅ View |

---

## 2. Database Schema Updates

### 2.1 Enhanced `profiles` Table
```sql
-- Add to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  avatar_url TEXT,
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  campus_id UUID REFERENCES campuses(id) ON DELETE SET NULL DEFAULT 'sanjivani-campus-uuid',
  cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE SET NULL DEFAULT 'cafe7-uuid';

-- Update role check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'kitchen', 'canteen_manager', 'admin'));

-- Index for role queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_campus ON profiles(campus_id);
CREATE INDEX IF NOT EXISTS idx_profiles_cafeteria ON profiles(cafeteria_id);
```

### 2.2 Staff Invitation Table
```sql
CREATE TABLE staff_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('kitchen', 'canteen_manager')),
  campus_id UUID REFERENCES campuses(id) ON DELETE CASCADE DEFAULT 'sanjivani-campus-uuid',
  cafeteria_id UUID REFERENCES cafeterias(id) ON DELETE CASCADE DEFAULT 'cafe7-uuid',
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  token VARCHAR(64) UNIQUE NOT NULL, -- secure random token
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ
);

CREATE INDEX idx_staff_invitations_token ON staff_invitations(token);
CREATE INDEX idx_staff_invitations_email ON staff_invitations(email);
```

### 2.3 Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50), -- 'user', 'menu_item', 'slot', 'order', 'invitation'
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

### 2.4 Enhanced RLS Policies
```sql
-- Profiles: Users read own, admins read all, managers read staff
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "profiles_select_manager" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
  AND role IN ('kitchen', 'canteen_manager', 'student')
);

-- Orders: Students own, staff/managers all, admins all
CREATE POLICY "orders_select_student" ON orders FOR SELECT USING (
  auth.uid() = user_id OR user_id IS NULL
);
CREATE POLICY "orders_select_staff" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
);
CREATE POLICY "orders_update_staff" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
);

-- Menu Items: Public read, managers/admins write
CREATE POLICY "menu_items_select_public" ON menu_items FOR SELECT USING (true);
CREATE POLICY "menu_items_manage_manager" ON menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);
CREATE POLICY "menu_items_stock_kitchen" ON menu_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('kitchen', 'canteen_manager', 'admin'))
);

-- Pickup Slots: Public read, managers/admins write
CREATE POLICY "pickup_slots_select_public" ON pickup_slots FOR SELECT USING (true);
CREATE POLICY "pickup_slots_manage_manager" ON pickup_slots FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);

-- Payments: Students insert own, staff/managers verify, admins all
CREATE POLICY "payments_insert_student" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "payments_verify_staff" ON payments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);
CREATE POLICY "payments_select_admin" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Staff Invitations: Admins/managers manage, invitees accept
CREATE POLICY "invitations_select_admin" ON staff_invitations FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
  OR email = (SELECT email FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "invitations_manage_admin" ON staff_invitations FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('canteen_manager', 'admin'))
);

-- Audit Logs: Admin read all, managers read own actions
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

### 3.1 Email Templates (Dashboard → Authentication → Email Templates)
* **Invite User (Custom):** Send to kitchen/canteen_manager with magic link + role.
* **Magic Link (Custom):** Auto-login for staff.
* **Confirm Signup (Custom):** Student email verification (optional).
* **Reset Password (Custom):** FoodLine-branded template for all roles.

### 3.2 Auth Providers
* **Email/Password** $\rightarrow$ Enabled (for staff invites).
* **Google OAuth** $\rightarrow$ Enabled, restricted to `@sanjivani.edu.in` domain.
* **Phone OTP** $\rightarrow$ Enabled for PRN login flow.

### 3.3 Auth Settings
* **Site URL:** `http://localhost:3000` (dev) / `https://foodline.campus` (prod).
* **Redirect URLs:** `/auth/callback`, `/menu`, `/kds`, `/admin`, `/display`, `/checkout`.
* **Session Timeout:** 30 days (students), 12 hours (staff/kitchen kiosk tablets).

---

## 4. Frontend Architecture

### 4.1 File Structure (Flat URLs — Canonical Routes)
```
frontend/src/
├── lib/
│   ├── auth/
│   │   ├── types.ts              # User, Role, Permission types
│   │   ├── permissions.ts        # Permission matrix & helpers
│   │   ├── useAuth.ts            # Auth context hook (supabase auth + profile)
│   │   └── usePermissions.ts     # Role-based access hook
│   ├── supabase/
│   │   ├── client.ts             # Browser client (existing)
│   │   └── server.ts             # Server client (existing)
│       -- NO admin.ts on client --
├── hooks/
│   ├── useRoleRedirect.ts        # Redirect based on role
│   └── useProfile.ts             # Fetch profile with role
├── middleware/
│   └── auth-middleware.ts        # Route protection (extends existing)
├── components/
│   ├── auth/
│   │   ├── RoleGate.tsx          # Wrapper for role-protected content
│   │   ├── LoginForm.tsx         # Enhanced login with role detection
│   │   ├── StaffInviteForm.tsx   # Admin/Manager invite staff (calls API route)
│   │   └── UserAvatar.tsx        # Role badge + menu
│   ├── layout/
│   │   ├── RoleNavbar.tsx        # Role-aware navbar
│   │   └── RoleSidebar.tsx       # Admin/Manager sidebar nav
│   ├── admin/
│   │   ├── UserManagement.tsx    # List/invite/remove staff
│   │   ├── RoleBadge.tsx         # Visual role indicator
│   │   └── InvitationManager.tsx # Pending/expired invites
│   └── display/
│       └── AudioSettingsDrawer.tsx # Gated admin controls for /display
├── app/
│   ├── display/page.tsx          # TV Counter Display (PUBLIC KIOSK)
│   ├── menu/page.tsx             # Student Menu (PUBLIC BROWSE)
│   ├── checkout/page.tsx         # Requires auth
│   ├── order/[token]/page.tsx    # Requires auth
│   ├── kds/page.tsx              # Kitchen staff & managers only
│   ├── admin/                    # Admin & Manager Data Hub
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── manager/                  # Canteen Manager views
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── menu/page.tsx
│   │   ├── slots/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── settlements/page.tsx
│   │   └── staff/page.tsx
│   ├── auth/
│   │   ├── callback/route.ts     # OAuth callback
│   │   ├── invite/[token]/page.tsx  # Staff invite acceptance
│   │   └── logout/route.ts
│   └── login/page.tsx            # Enhanced with role detection
├── actions/
│   └── admin/
│       ├── invite.ts             # Server Action: create invitation
│       ├── revoke-invitation.ts  # Server Action: revoke invitation
│       ├── update-user-role.ts   # Server Action: change user role
│       └── deactivate-user.ts    # Server Action: deactivate user
└── api/
    └── admin/
        ├── invite/route.ts       # POST: create invitation (calls Server Action)
        ├── invitations/route.ts  # GET: list invitations
        ├── users/route.ts        # GET/POST: list users, invite
        └── users/[id]/route.ts   # PATCH/DELETE: update role, deactivate
```

### 4.2 Role Detection & Routing Logic
```typescript
// lib/auth/useAuth.ts
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'kitchen' | 'canteen_manager' | 'admin';
  prn?: string;
  department?: string;
  avatar_url?: string;
  is_active: boolean;
  campus_id?: string;
  cafeteria_id?: string;
}

const ROLE_ROUTES = {
  student: '/menu',
  kitchen: '/kds',
  canteen_manager: '/manager/dashboard',
  admin: '/admin',
};

const SESSION_DURATION = {
  student: 30 * 24 * 60 * 60,  // 30 days
  kitchen: 12 * 60 * 60,       // 12 hours
  canteen_manager: 12 * 60 * 60,
  admin: 12 * 60 * 60,
};

function getDefaultRoute(role: UserProfile['role']): string {
  return ROLE_ROUTES[role] || '/menu';
}

function getSessionMaxAge(role: UserProfile['role']): number {
  return SESSION_DURATION[role] || SESSION_DURATION.student;
}
```

### 4.3 Middleware Route Protection
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

// ONLY these routes require authentication + role check
const PROTECTED_ROUTES: Record<string, string[]> = {
  '/kds': ['kitchen', 'canteen_manager', 'admin'],
  '/manager': ['canteen_manager', 'admin'],
  '/admin': ['admin'],
  '/checkout': ['student', 'canteen_manager', 'admin'], // auth required at checkout
  '/order': ['student', 'canteen_manager', 'admin'],   // auth required for order tracking
};

// PUBLIC routes (no auth, no redirect):
// - /display (TV kiosk mode)
// - /menu (guest browsing allowed)
// - /login
// - /auth/*

export async function middleware(request: NextRequest) {
  const { supabase, response } = createServerClient(request);
  const { data: { user } } = await supabase.auth.getUser();
  
  const pathname = request.nextUrl.pathname;
  
  // Check if route is protected
  const protectedEntry = Object.entries(PROTECTED_ROUTES).find(([route]) => 
    pathname.startsWith(route)
  );
  
  if (!protectedEntry) {
    // Public route - allow through
    return response;
  }
  
  const [, allowedRoles] = protectedEntry;
  
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Fetch profile for role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single();

  if (!profile?.is_active) {
    return NextResponse.redirect(new URL('/login?error=deactivated', request.url));
  }

  if (!allowedRoles.includes(profile.role)) {
    // Redirect to role-appropriate dashboard
    return NextResponse.redirect(new URL(getDefaultRoute(profile.role), request.url));
  }

  return response;
}
```

---

## 5. Role-Specific UI Requirements

### 5.1 Student (Guest Browse + Auth at Checkout)
* `/menu`: Public browsing — no login required. Full menu, search, dietary badges, and filters work.
* `/checkout`: Requires auth (Google SSO / PRN+OTP). Redirects to login with `?redirect=/checkout`.
* `/order/[token]`: Live digital pass and tracking.
* **Navbar:** Shows "Login" when guest; Cart/Orders/Profile when authenticated.

### 5.2 Kitchen Staff (`/kds`)
* **Layout:** Full-screen KDS, sound alerts, no consumer navbar.
* **Features:** Kanban board, live portion stock counters (`[-5]/[-1]/[+1]/[+5]`), 1-tap price adjust.
* **Access:** Real-time orders, mark `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COLLECTED`.
* **Restricted:** Platform financials, user management.

### 5.3 Canteen Manager (`/manager/*` or `/admin`)
* **Layout:** Operations dashboard.
* **Tabs:**
  * **Dashboard:** Real-time orders, slot capacity, today's stats.
  * **Menu:** Full CRUD (add/edit/delete dishes, pricing, stock).
  * **Slots:** Create/edit break slots, capacity management.
  * **Orders:** Master ledger, status override, COD cash collection.
  * **Settlements:** UTR verification, payment audit.
  * **Staff:** Invite kitchen staff, view active staff.
* **Financial View:** Canteen Net Food Sales only (96.6% food subtotal payout) — founder margin hidden.

### 5.4 Admin / Founder (`/admin/*`)
* **Layout:** Executive Manager & Admin Data Hub.
* **Tabs:**
  * **Dashboard:** Financial split waterfall (96.6% vs 3.4%), system health.
  * **Users:** All users, invite staff, deactivate, role changes.
  * **Financials:** Full Revenue Split Waterfall — Canteen (96.6%) + Founder Margin (3.4% Fast-Pass Tech Platform Surcharge), COD vs UPI, Bank UTR audits.
  * **Audit:** System logs, RLS policy checks, API usage.
  * **Settings:** Platform config, commission rates, campus setup.
* **Permissions:** Full system access, financial split view, user management, impersonation toggle.

### 5.5 TV Counter Display (`/display`) — Public Kiosk Mode
* **No authentication required** — loads directly on TV browser.
* Supabase Realtime streams orders via public anon key.
* Audio Settings Drawer (voice language/mute) gated by `RoleGate` for `['kitchen', 'canteen_manager', 'admin']`.
* Screen Wake Lock API active.

---

## 6. Server Actions (No Service Role Key on Client)

### 6.1 Admin Actions (`frontend/src/actions/admin/`)
```typescript
// actions/admin/invite.ts
'use server';
export async function createStaffInvitation(data: {
  email: string;
  role: 'kitchen' | 'canteen_manager';
  campus_id: string;
  cafeteria_id: string;
}) {
  const supabase = createServerActionClient(); // service role via server-only env
  // 1. Create invitation record
  // 2. Send magic link via supabase.auth.admin.inviteUserByEmail()
  // 3. Log to audit_logs
}
```

### 6.2 API Routes (`frontend/src/app/api/admin/`)
* `/api/admin/invite/route.ts`: POST $\rightarrow$ create invitation.
* `/api/admin/invitations/route.ts`: GET $\rightarrow$ list invitations.
* `/api/admin/users/route.ts`: GET/POST $\rightarrow$ list users, invite.
* `/api/admin/users/[id]/route.ts`: PATCH/DELETE $\rightarrow$ update role, deactivate.

---

## 7. Financial Split Contract (Explicit)

| Metric | Canteen Manager View | Admin / Founder View |
|---|---|---|
| **Gross GMV** | Hidden | ✅ Visible |
| **Canteen Net Food Sales** | ✅ Primary metric (96.6%) | ✅ Visible |
| **Founder Margin (3.4%)** | ❌ Hidden | ✅ "Fast-Pass Tech Platform Surcharge" |
| **COD vs UPI Split** | ✅ Visible | ✅ Visible |
| **UTR Verification** | ✅ Verify only | ✅ Full audit + export |
| **Staff User Management** | ✅ Invite kitchen only | ✅ All roles + deactivate |
| **Audit Logs** | ❌ Hidden | ✅ Full system audit |

$$\text{Food Subtotal} = \frac{\text{Gross GMV}}{1.035}$$
$$\text{Founder Margin} = \text{Gross GMV} - \text{Food Subtotal}\ (3.4\%)$$
$$\text{Canteen Payout} = \text{Food Subtotal}\ (96.6\%)$$

---

## 8. Implementation Phases

| Phase | Description | Est. Hours |
|---|---|---|
| **Phase 1: Database & Auth Foundation** | Profiles table extensions, `staff_invitations` + `audit_logs` tables, RLS policies, Supabase Auth config. | 4 hrs |
| **Phase 2: Auth Context & Middleware** | `useAuth` hook, `usePermissions` hook, `middleware.ts` (public `/display`, `/menu`), `RoleGate.tsx`. | 4 hrs |
| **Phase 3: Public + Protected Layouts** | Canonical flat URLs, `RoleNavbar`, `RoleSidebar`. | 3 hrs |
| **Phase 4: Manager Dashboard** | Menu CRUD, slot management, orders oversight, UTR verify, staff management. | 5 hrs |
| **Phase 5: Admin Dashboard & User Mgmt** | Full user management, financial split dashboard (96.6% / 3.4%), audit logs, Server Actions. | 5 hrs |
| **Phase 6: TV Display + Polish** | Public `/display` with gated AudioSettingsDrawer, guest `/menu`, invite acceptance page, avatar menu. | 3 hrs |
| **Total** | | **~24 hrs** |

---

## 9. Resolved Architectural Decisions

| # | Decision | Resolution |
|---|---|---|
| **1** | **Multi-Campus** | Added `campus_id` & `cafeteria_id` to `profiles` with defaults to Sanjivani University (`Cafe @7`). Ready for multi-campus expansion. |
| **2** | **Student Registration** | Auto-create profile with `role: 'student'` on first Google OAuth (`@sanjivani.edu.in`) or Phone OTP login. Staff roles remain invite-only. |
| **3** | **Session Duration** | 30 days for students (semester-long); 12 hours for staff/kitchen kiosk tablets (shift-based). |
| **4** | **Impersonation** | Add Admin "View As" toggle in `/admin` to preview Student/Kitchen/Manager UIs without altering database tokens. |
| **5** | **Audit Logging** | Added `audit_logs` table (`actor_id`, `action`, `target_type`, `target_id`, `metadata`, `created_at`). RLS: Admin sees all, Manager sees own actions. |
| **6** | **Password Reset** | Standard Supabase Auth reset emails with FoodLine-branded templates. |

---

## 10. Acceptance Criteria

1. **Student Flow:** Guest browses `/menu` $\rightarrow$ Auth at `/checkout` (Google SSO / PRN+OTP) $\rightarrow$ digital pass generated.
2. **TV Display:** `/display` loads directly on TV kiosk without auth $\rightarrow$ Supabase Realtime streams orders $\rightarrow$ Audio settings gated by `RoleGate`.
3. **Kitchen Staff:** Email invite $\rightarrow$ set password $\rightarrow$ `/kds` $\rightarrow$ kanban + stock steppers only.
4. **Canteen Manager:** Email invite $\rightarrow$ `/manager/dashboard` $\rightarrow$ full CRUD menu/slots/orders/settlements $\rightarrow$ sees Canteen Net Food Sales (96.6%) only.
5. **Admin:** Email invite $\rightarrow$ `/admin` $\rightarrow$ user management + Full Revenue Split (96.6% / 3.4%) + audit + impersonation.
6. **Route Protection:** Unauthorized access redirects to role-appropriate dashboard; `/display` and `/menu` never redirect.
7. **RLS Enforcement:** Database-level protection matches UI permissions.
8. **No Service Role on Client:** All admin operations via Server Actions / API Routes.
9. **Session Persistence:** 30d student, 12h staff, survives page refresh.
10. **Invite Expiry:** 7 days, one-time use, revocable.

---

**Plan saved to:** [`.opencode/plans/USER_ROLES_PLAN.md`](file:///run/media/darkkakashi/Laptop%20NVME%20Data%20Drive/old%20windows%2011/desktop/PPT%20OTHER%20TASKES/.opencode/plans/USER_ROLES_PLAN.md)