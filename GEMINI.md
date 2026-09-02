# 🛡️ FoodLine Campus — Global Standard AI Engineering Ruleset
<!-- Battle-tested rules compiled from Cursor Directory, Anthropic Guidelines, & DeepMind Agent Patterns -->

## 0. 🧠 Memory & State Persistence (Session Continuity)
- **Always Read `PROJECT_MEMORY.md` First:** At the beginning of any session or before executing tasks, inspect `PROJECT_MEMORY.md` to restore full context on where we left off and what your assigned mission is.
- **Update Memory Upon Milestone Completion:** When a milestone is verified, keep `PROJECT_MEMORY.md` updated so future agent sessions never lose context.

## 1. 🧠 Core Philosophy & Anti-Hallucination
- **Verify Before Asserting:** Never assume a library, API endpoint, or file exists. Inspect `package.json`, `git status`, or run `grep_search` before importing or referencing.
- **Never Reinvent the Wheel:** Search the codebase for existing utility functions and UI components before writing new ones from scratch.
- **Explain Like I'm 10 When Asked:** Translate complex architectural concepts into clear, simple analogies without condescending jargon.

---

## 2. ⚡ Autonomous Self-Healing & Verification Loop
- **The Compilation Guarantee:** Every single edit MUST be verified. After modifying backend or frontend code, run:
  - Frontend check: `npm --prefix frontend run build`
  - Backend check: `npm --prefix backend run build`
- **Fix Before Reporting:** If a command or build produces an error or TypeScript lint warning, diagnose and resolve it immediately. Never report a task as "Done" if the build fails.
- **One LEGO Brick Rule:** Implement features incrementally. Deliver one verifiable component/endpoint at a time.

---

## 3. 🔒 Security, Privacy & Secret Protection (OWASP Standards)
- **Absolute Secret Isolation:** NEVER log, display, edit, or commit `.env`, `.env.local`, Supabase service role keys, or sensitive auth tokens.
- **Parameterized Queries:** All Supabase/PostgreSQL interactions must use parameterized queries or the official SDK. Never concatenate unescaped user input into SQL.
- **Data Minimization (DPDP/FSSAI Compliance):** Only store necessary student data (PRN, minimal contact info). Mask phone numbers in client-side logs.

---

## 4. 🎨 Modern Frontend Standards (Antigravity CLI 'agy' Agent)
- **Strict Typing:** No `any`. All props, API response hooks, and state slices must have explicit TypeScript interfaces imported from `src/lib/types.ts`.
- **Aesthetic Excellence:** Adhere to `FoodLine_App_UI_UX_Design_System.md`. Use Tailwind CSS utility tokens, subtle glassmorphism, responsive breakpoints (`sm`, `md`, `lg`), and smooth micro-animations.
- **Defensive UI States:** Every interactive component must handle:
  1. `Loading` (skeleton or smooth spinner)
  2. `Empty` (friendly empty-state illustration/text)
  3. `Error` (toast or retry button)
  4. `Success` (subtle haptic/audio or badge update)

---

## 5. 🛠️ Robust Backend Standards (Antigravity IDE Agent)
- **Idempotency & Race Protection:**
  - Enforce the 60-order slot throttling limit strictly before creating an order record.
  - Implement 12-digit UTR replay protection to prevent duplicate transaction entries.
- **Resilient Error Responses:** All API route handlers must return standard JSON envelopes:
  `{ success: boolean, data?: any, error?: string, meta?: object }` with accurate HTTP status codes (200, 201, 400, 404, 409, 500).

---

## 6. 🌲 Multi-Agent Worktree Hygiene
- **Branch Ownership:**
  - Antigravity IDE works on `FoodLine-Backend` on branch `backend` (and backend engine APIs).
  - Antigravity CLI (`agy`) works on `FoodLine-Frontend` on branch `frontend` (and frontend UI).
  - Master merges happen only into `PPT OTHER TASKES` on branch `main`.
- **Clean Git Commits:** Write conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`). Never use `git reset --hard` or destructive operations without explicit confirmation.
