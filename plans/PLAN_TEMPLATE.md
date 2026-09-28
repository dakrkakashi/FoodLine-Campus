# [Plan Title]: [Brief Feature or Fix Name]

> **Status:** `PENDING` *(Options: PENDING | IN_PROGRESS | COMPLETED | BLOCKED)*  
> **Created By:** OpenCode  
> **Target Execution Agent:** Antigravity  
> **Created At:** [YYYY-MM-DD]  
> **Pending Location:** `plans/pending-plans/`  
> **Completed Location:** `plans/completed-plans/`  

---

## 🎯 1. Objective & Problem Statement
*Describe clearly what this feature or fix achieves and why it is needed.*

---

## 🏗️ 2. Architectural Overview & Context
*Key design decisions, data flow, endpoints, or state management considerations.*
- **Affected Subsystems:** `frontend/` | `backend/` | `database/`
- **Related Docs/Schemas:** (e.g. `supabase_schema.sql`, `frontend/src/lib/types.ts`)

---

## 📁 3. File Modification Matrix

| File Path | Action | Description |
|---|---|---|
| `frontend/src/...` | Create / Edit | Purpose of change |
| `backend/src/...` | Create / Edit | Purpose of change |

---

## 📝 4. Detailed Implementation Tasks

- [ ] **Task 1: [Component / Backend logic]**
  - Details: ...
  - Target files: `...`
- [ ] **Task 2: [State / API integration]**
  - Details: ...
  - Target files: `...`
- [ ] **Task 3: [Edge cases & UI polish]**
  - Details: ...
  - Target files: `...`

---

## 🧪 5. Verification & Acceptance Criteria

1. **Compilation Check:**
   ```bash
   npm --prefix frontend run build
   ```
2. **Behavioral Acceptance Criteria:**
   - [ ] Criterion 1
   - [ ] Criterion 2
3. **No Breaking Changes:** Existing routes and contracts must remain green.

---

## 📋 6. Antigravity Execution Log
*(Antigravity will fill this section during and after execution)*

- **Started At:** 
- **Completed At:** 
- **Verification Output:** 
- **Notes / Deviations:** 

When all acceptance criteria pass, set the status to `COMPLETED`, append the
execution log, update `PROJECT_MEMORY.md` and `MULTI_AGENT_SYNC.md`, and move
the file to `plans/completed-plans/`. If blocked, set the status to `BLOCKED`,
document the blocker, and leave the file in `plans/pending-plans/`.
