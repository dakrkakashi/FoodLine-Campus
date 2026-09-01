#!/usr/bin/env fish
# start.fish — 1-Command Master Launcher with Persistent Memory & Server Boot

set SCRIPT_DIR (cd (dirname (status -f)); and pwd)
set PARENT_DIR (dirname "$SCRIPT_DIR")
set BACKEND_DIR "$PARENT_DIR/FoodLine-Backend"
set FRONTEND_DIR "$PARENT_DIR/FoodLine-Frontend"
set MEMORY_FILE "$SCRIPT_DIR/PROJECT_MEMORY.md"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 FOODLINE CAMPUS — MASTER BOOT & MEMORY RESTORE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Clear any stuck ports (3000 & 4000)
echo "🧹 Checking & clearing ports 3000 & 4000..."
fuser -k 3000/tcp 4000/tcp 2>/dev/null
sleep 0.5

# 2. Display Persistent Agent Memory Checkpoint
if test -f "$MEMORY_FILE"
    echo "🧠 Restoring Agent Memory from: PROJECT_MEMORY.md"
    echo "────────────────────────────────────────────────────────────"
    # Extract Last Checkpoint and Missions
    grep -E "^\- \*\*Date|^\- \*\*GitHub|^\- \*\*Worktree|^### ⚡ Mission|^### 🎨 Mission" "$MEMORY_FILE" | head -n 8
    echo "────────────────────────────────────────────────────────────"
end

# 3. Boot Backend Server (:4000) in background
echo "⚡ Starting Backend Engine (:4000) in background..."
cd "$SCRIPT_DIR"
npm run dev:backend >/dev/null 2>&1 &
set BACKEND_PID $last_pid

# 4. Boot Frontend Server (:3000) in background
echo "🚀 Starting Frontend Next.js (:3000) in background..."
npm run dev:frontend >/dev/null 2>&1 &
set FRONTEND_PID $last_pid

# 5. Launch Agents into their dedicated worktrees
if test -d "$BACKEND_DIR"
    echo "🤖 Launching Antigravity in: $BACKEND_DIR (branch: backend)"
    antigravity "$BACKEND_DIR" &
else
    echo "🤖 Launching Antigravity in: $SCRIPT_DIR/backend"
    antigravity "$SCRIPT_DIR/backend" &
end

if test -d "$FRONTEND_DIR"
    echo "🎨 Launching OpenCode in:    $FRONTEND_DIR (branch: frontend)"
    opencode "$FRONTEND_DIR" &
else
    echo "🎨 Launching OpenCode in:    $SCRIPT_DIR/frontend"
    opencode "$SCRIPT_DIR/frontend" &
end

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✨ EVERYTHING IS LIVE & RUNNING!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🌐 Frontend App:    http://localhost:3000"
echo "  ⚡ Backend Engine:  http://localhost:4000"
echo "  🧠 Memory State:    PROJECT_MEMORY.md"
echo "  📋 API Contracts:   AGENTS.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  💡 Pro Tip: Run 'fl ports' to check servers, 'fl kill' to stop."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
