#!/data/data/com.termux/files/usr/bin/bash
# Termux one-touch starter for Offline AI Chat
# - Starts ollama (if not running)
# - Optionally pulls a default model (tinyllama) on first run
# - Starts Flask backend

set -e

APP_DIR="$(dirname "$0")"
cd "$APP_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[*]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err() { echo -e "${RED}[x]${NC} $1"; }

# 1) Ensure Python deps
if [ -f backend/requirements.txt ]; then
  log "Installing Python dependencies..."
  pip install --no-cache-dir -r backend/requirements.txt
fi

# 2) Ensure ollama up
if command -v ollama >/dev/null 2>&1; then
  if ! pgrep -f "ollama serve" >/dev/null 2>&1; then
    warn "Starting Ollama..."
    nohup ollama serve >/dev/null 2>&1 &
    sleep 2
  fi
  if ! curl -s http://127.0.0.1:11434/api/version >/dev/null; then
    warn "Waiting for Ollama to become ready..."
    for i in $(seq 1 15); do
      sleep 1
      if curl -s http://127.0.0.1:11434/api/version >/dev/null; then break; fi
    done
  fi
  if ! curl -s http://127.0.0.1:11434/api/tags | grep -q tinyllama; then
    warn "Pulling a small default model: tinyllama (first time only)"
    ollama pull tinyllama || true
  fi
else
  warn "Ollama not found in PATH. Please install it first."
fi

# 3) Start Flask
export FLASK_HOST=0.0.0.0
export FLASK_PORT=5000
export OLLAMA_HOST=127.0.0.1
export OLLAMA_PORT=11434

log "Starting Flask on http://$FLASK_HOST:$FLASK_PORT ..."
PYTHONPATH=backend python -m flask --app backend.app run --host "$FLASK_HOST" --port "$FLASK_PORT"
