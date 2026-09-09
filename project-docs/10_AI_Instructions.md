# 🤖 10 • AI Agent Instructions & Spec-Driven Development Rules
**Project Name:** FoodLine Campus  
**Target Systems:** Antigravity IDE, Antigravity CLI ('agy'), Claude Code, Cursor, GitHub Copilot  
**Status:** Mandatory Enforced Ruleset

---

## 1. The Core Philosophy: Spec-Driven Development (SDD)

When working on the FoodLine Campus codebase, **never guess or assume requirements**.  
Always read the appropriate specification file inside `/project-docs/` before proposing, writing, or editing code:

| What You Need to Know | Read This Spec File |
|---|---|
| Business requirements, problem statement, user personas | `project-docs/01_PRD.md` |
| Feature workflows, throttling rules, KDS & TV specs | `project-docs/02_Features.md` |
| Colors, design tokens, 12 themes, anti-vibecoding rules | `project-docs/03_UIUX.md` |
| Libraries, package versions, port allocation | `project-docs/04_TechStack.md` |
| Database schema, tables, foreign keys, Google Sheets API | `project-docs/05_Database.md` |
| REST endpoints, JSON:API format, SSE stream payloads | `project-docs/06_API.md` |
| Concurrency, race condition guards, architectural flow | `project-docs/07_Architecture.md` |
| UTR fraud rules, DPDP 24h purge, OWASP compliance | `project-docs/08_Security.md` |
| Deployment configs, environment variables, Android build | `project-docs/09_Deployment.md` |

---

## 2. The 5 Mandatory Rules of Engagement

### Rule 1: The Compilation Guarantee ⚡
Every single edit MUST be verified. After modifying frontend or backend code:
- **Frontend Check:** `npm --prefix frontend run build` (Must compile all 41 routes with 0 errors).
- **Backend Check:** `npm --prefix backend run build` (Must compile TypeScript cleanly).
- **Never report a task as "Done" if the build fails.** Fix errors immediately.

### Rule 2: Zero Fake Databases Policy 🛡️
- **NEVER create fake JSON files** (e.g. `mock-orders.json`, `fake-inventory.json`).
- All reads and writes must interact with real Supabase PostgreSQL tables or real Google Sheets API v4 endpoints.
- If testing is required, use isolated test IDs and clean them up after execution.

### Rule 3: The "One LEGO Brick" Rule 🧱
- Implement features incrementally. Deliver one verifiable component, service, or endpoint at a time.
- Do not attempt to rewrite 10 files in a single turn without compiling.

### Rule 4: Anti-Vibecoding Aesthetic Enforcement 🎨
- Never use generic purple-on-black radial blur orbs.
- Every dynamic route must have a buttery-smooth skeleton shimmer loader.
- Adhere strictly to the Tailwind CSS v4 design tokens and CSS custom properties defined in `03_UIUX.md`.

### Rule 5: Continuous `MULTI_AGENT_SYNC.md` Logging (MANDATORY) 🤝
- Every agent (Antigravity CLI and Antigravity IDE) MUST append an update log to `MULTI_AGENT_SYNC.md` on every single turn before concluding.
- Neither agent may finish work without posting a status update so the pair remains in 100% continuous synchronization.

---

## 3. How to Prompt AI Coding Assistants with `/project-docs/`

To get 100% precision from any AI assistant:

```markdown
"Read all files inside /project-docs/.
We are implementing [Feature Name] for FoodLine Campus.
Strictly adhere to:
- Schema and tables in 05_Database.md
- REST/SSE contracts in 06_API.md
- Design tokens and skeleton states in 03_UIUX.md
- Anti-fraud and security rules in 08_Security.md
Do not use mock data. Compile with 'npm run build' after implementation."
```
