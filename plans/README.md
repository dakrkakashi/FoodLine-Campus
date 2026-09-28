# Antigravity and OpenCode Planning Hub

OpenCode creates implementation plans. Antigravity executes, verifies, and
archives them.

## Workflow

1. OpenCode reads the project context and writes every new plan to
   `plans/pending-plans/<FEATURE_NAME>_PLAN.md`.
2. Antigravity scans `plans/pending-plans/` and selects a plan with
   `Status: PENDING`.
3. Antigravity changes the plan to `IN_PROGRESS`, implements the tasks, and runs
   all required verification commands.
4. After every acceptance criterion passes, Antigravity marks the plan
   `COMPLETED`, appends the execution log, updates project synchronization
   records, and moves it to `plans/completed-plans/`.
5. If blocked, Antigravity marks the plan `BLOCKED`, records the evidence, and
   leaves it in `plans/pending-plans/`.

## Directory layout

```text
plans/
├── README.md
├── PLAN_TEMPLATE.md
├── OPENCODE_PROMPT.md
├── pending-plans/             # New and blocked plans
└── completed-plans/           # Verified completed plans
```

Only `plans/pending-plans/` is used for new plans. Do not delete plans or skip
verification to force a move.

## Executor prompt

Use this prompt with the second AI:

```text
You are the FoodLine Campus implementation and verification agent.

Read PROJECT_MEMORY.md, MULTI_AGENT_SYNC.md, plans/README.md, and the selected
plan before editing. Your source of truth is plans/pending-plans/.

Select the requested plan, or the oldest valid plan if no filename is given.
Confirm Status: PENDING, change it to IN_PROGRESS, and execute its tasks
without unrelated changes. Preserve API contracts, database integrity,
accessibility, security, and existing worktree changes.

Run every verification command in the plan. At minimum, run:
- Frontend: npm --prefix frontend run build
- Backend: npm --prefix backend run build
- Backend tests: npm --prefix backend run test
- Cross-stack when applicable: npm run build

Fix failures and rerun verification. Append an execution log with timestamps,
changed files, commands, results, deviations, and risks.

When all acceptance criteria pass, set Status: COMPLETED, update
PROJECT_MEMORY.md and MULTI_AGENT_SYNC.md, then move the plan to
plans/completed-plans/.

If blocked, set Status: BLOCKED, document the exact blocker and attempted
fixes, and leave the plan in plans/pending-plans/.

Never delete plans, skip verification, expose secrets, or modify unrelated
worktree changes.
```

## Trigger examples

```text
Scan plans/pending-plans/ and execute the pending plan.
Execute plans/pending-plans/PERFORMANCE_OPTIMIZATION_PLAN.md.
```
