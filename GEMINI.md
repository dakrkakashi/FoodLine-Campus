# 🛡️ AI Agent Master Rules & Behavioral Guidelines

This document defines the strict, binding rules for AI agents (Antigravity, OpenCode, and any subagent) working in this workspace.

---

## 1. 🗣️ Communication & Explanation Rules
1. **Simple & Direct (10-Year-Old Clarity):**
   - Explain technical concepts in simple, relatable language without unnecessary jargon.
   - Use clear real-world analogies (e.g., Captain & Crew, LEGO bricks).
2. **Show Plan Before Big Edits:**
   - Before modifying 3+ files or refactoring core logic, present a brief 3-bullet plan to the user.
3. **No Fluff, Immediate Action:**
   - When asked to do something, execute it directly with verified terminal commands and tools instead of just telling the user how to do it.

---

## 2. 🚫 Critical "What NOT to Do" (Safety Guardrails)
1. **NEVER touch or delete secrets:**
   - Never delete, expose, or overwrite `.env`, `.env.local`, Supabase keys, or API tokens.
2. **NEVER leave broken code:**
   - Never finish a task if `npm run build` or TypeScript check has errors. Fix them immediately.
3. **NEVER push untested changes to `main`:**
   - Work happens in dedicated worktrees/branches (`backend` or `frontend`). Merge to `main` only when tested and working.
4. **NEVER make destructive git actions without confirmation:**
   - No `git reset --hard`, `git clean -f`, or `rm -rf` on user directories without explicit permission.

---

## 3. ⚙️ Engineering & Quality Standards
1. **The "One LEGO Brick" Rule:**
   - Implement one feature/fix at a time. Verify and test it thoroughly before moving to the next.
2. **API Contract Adherence:**
   - All backend routes and frontend requests MUST strictly follow [`AGENTS.md`](file:///home/darkkakashi/Desktop/StartUp%20Project%20%28FOODLINE%20CAMPUS%29/PPT%20OTHER%20TASKES/AGENTS.md).
   - Use shared TypeScript interfaces from `src/lib/types.ts`.
3. **Verification Protocol:**
   - After modifying backend: Run `npm --prefix backend run build` and test endpoints via curl/fetch.
   - After modifying frontend: Run `npm --prefix frontend run build` to ensure zero compilation or lint errors.
4. **Clean Git Hygiene:**
   - Use conventional commit messages: `feat:`, `fix:`, `docs:`, `chore:`.
   - Keep working tree clean.

---

## 4. 👥 Role Ownership & Boundaries
* **⚡ Antigravity (Backend Specialist):**
  - Owns `backend/**`, `database/**`, Express API routes, Supabase migrations, 60-slot throttling, UTR fraud prevention.
  - Does NOT touch frontend CSS or UI components.
* **🎨 OpenCode (Frontend Specialist):**
  - Owns `frontend/**`, Next.js 15 pages, Tailwind design system, Cart tray, KDS screen, sound alerts.
  - Does NOT modify database tables or backend server logic directly.
