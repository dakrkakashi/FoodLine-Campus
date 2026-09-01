#!/usr/bin/env fish
# start.fish — Launch Antigravity & OpenCode in dedicated worktrees

set SCRIPT_DIR (cd (dirname (status -f)); and pwd)
set PARENT_DIR (dirname "$SCRIPT_DIR")
set BACKEND_DIR "$PARENT_DIR/FoodLine-Backend"
set FRONTEND_DIR "$PARENT_DIR/FoodLine-Frontend"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Launching FoodLine Campus Isolated Worktrees"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Antigravity -> FoodLine-Backend worktree (Branch: backend)
if test -d "$BACKEND_DIR"
    echo "⚡ Launching Antigravity in Backend Worktree: $BACKEND_DIR"
    antigravity "$BACKEND_DIR" &
else
    echo "⚡ Launching Antigravity in: $SCRIPT_DIR/backend"
    antigravity "$SCRIPT_DIR/backend" &
end

# 2. OpenCode -> FoodLine-Frontend worktree (Branch: frontend)
if test -d "$FRONTEND_DIR"
    echo "🎨 Launching OpenCode in Frontend Worktree: $FRONTEND_DIR"
    opencode "$FRONTEND_DIR" &
else
    echo "🎨 Launching OpenCode in: $SCRIPT_DIR/frontend"
    opencode "$SCRIPT_DIR/frontend" &
end

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Both agents running on isolated branches & folders!"
echo "📂 Backend Worktree:  $BACKEND_DIR (branch: backend)"
echo "📂 Frontend Worktree: $FRONTEND_DIR (branch: frontend)"
echo "📋 Contract:          $SCRIPT_DIR/AGENTS.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
