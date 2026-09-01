#!/usr/bin/env fish
# start.fish — Launch Antigravity & OpenCode in parallel for FoodLine Campus

set SCRIPT_DIR (cd (dirname (status -f)); and pwd)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Launching FoodLine Campus Multi-Agent Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Launch Antigravity for Backend
echo "⚡ Starting Antigravity (Backend Specialist)..."
antigravity "$SCRIPT_DIR" &

# 2. Launch OpenCode for Frontend
echo "🎨 Starting OpenCode (Frontend Specialist)..."
opencode "$SCRIPT_DIR" &

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Both agents running in parallel!"
echo "📋 Contract Guide: $SCRIPT_DIR/AGENTS.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
