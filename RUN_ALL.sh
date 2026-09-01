#!/usr/bin/env fish
# 🚀 Run All: Clear ports, restore memory, boot servers, and launch AI agents

set SCRIPT_DIR (cd (dirname (status -f)); and pwd)
cd "$SCRIPT_DIR"
./start.fish
