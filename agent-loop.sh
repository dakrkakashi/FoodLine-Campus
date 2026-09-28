#!/usr/bin/env bash
# agent-loop.sh
# Loop: opencode plans -> agy (antigravity) executes -> agy scans for
# bugs/improvements -> scan feeds back into the next opencode plan -> repeat.
#
# USAGE:
#   ./agent-loop.sh "Build a responsive navbar with a mobile hamburger menu"
#
# You WILL need to adjust the exact opencode/agy command flags below to match
# your installed CLI versions — run `opencode --help` and `agy --help` (or
# `antigravity-cli --help`) first and swap in the correct non-interactive
# run flags for your version.

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 \"<initial goal / task description>\""
  exit 1
fi

GOAL="$1"
MAX_ITER=10          # hard stop so this can't run forever
LOG="loop-log.md"
WORKDIR="$(pwd)"

echo "# Agent loop log — $(date)" > "$LOG"
echo "Goal: $GOAL" >> "$LOG"

iteration=1
current_task="$GOAL"

while [ "$iteration" -le "$MAX_ITER" ]; do
  echo ""
  echo "===== Iteration $iteration ====="
  echo "## Iteration $iteration" >> "$LOG"

  # ---- 1. OpenCode drafts/updates the plan ----
  echo "-- Planning with OpenCode --"
  echo "### Plan (OpenCode)" >> "$LOG"
  plan_file="plan-$iteration.md"

  opencode run \
    "Create a concrete, step-by-step implementation plan for the following task. Output only the plan, no commentary:

$current_task" \
    > "$plan_file" 2>&1 || { echo "OpenCode planning step failed — see $plan_file"; break; }

  cat "$plan_file" >> "$LOG"

  # ---- 2. Antigravity executes the plan ----
  echo "-- Executing with Antigravity --"
  echo "### Execute (Antigravity)" >> "$LOG"
  exec_file="exec-$iteration.md"

  agy run \
    --prompt "Execute this plan exactly, making the described code changes to the project in this directory. Report what you changed:

$(cat "$plan_file")" \
    > "$exec_file" 2>&1 || { echo "Antigravity execution step failed — see $exec_file"; break; }

  cat "$exec_file" >> "$LOG"

  # ---- 3. Antigravity scans the project for issues ----
  echo "-- Scanning with Antigravity --"
  echo "### Scan (Antigravity)" >> "$LOG"
  scan_file="scan-$iteration.md"

  agy run \
    --prompt "Scan the current project for bugs, errors, and concrete improvement opportunities. List them as short, specific bullet points (file + issue). If you find nothing worth fixing, output exactly this token and nothing else: NO_ISSUES_FOUND" \
    > "$scan_file" 2>&1 || { echo "Antigravity scan step failed — see $scan_file"; break; }

  cat "$scan_file" >> "$LOG"

  # ---- 4. Decide: stop, or feed the scan back as the next task ----
  if grep -q "NO_ISSUES_FOUND" "$scan_file"; then
    echo ""
    echo "Scan came back clean — stopping after $iteration iteration(s)."
    echo "Clean stop after $iteration iteration(s)." >> "$LOG"
    exit 0
  fi

  current_task="Fix the following issues found in the project:

$(cat "$scan_file")"

  iteration=$((iteration + 1))
done

echo ""
echo "Reached max iterations ($MAX_ITER) without a clean scan."
echo "Review $LOG and the plan-*/exec-*/scan-*.md files, then either raise MAX_ITER or fix remaining issues manually."
