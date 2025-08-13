# Edge-ai

Offline AI Chat (Android Termux + Flask + Ollama)

A self-contained, offline chat UI that runs on Android using Termux and local Ollama models. No cloud. No trackers. Just your phone. You can also preview locally on Windows.

## Folder structure

```
edge-ai/
├─ backend/
│  ├─ app.py               # Flask app serving API and static frontend
│  └─ requirements.txt     # Python dependencies (Flask + requests)
├─ frontend/
│  ├─ index.html           # Mobile-first chat UI
│  ├─ styles.css           # Local styles (dark/light)
│  └─ app.js               # Local JS logic (chat, models, storage)
├─ start.sh                # One-touch starter for Termux
├─ start.ps1               # One-touch starter for Windows preview
└─ logs.txt                # Created at runtime for basic logging
```

## What you need
- An Android phone (ARM64 works best)
- Termux (from F-Droid or Play Store)
- Internet only for the initial installation and model download

## Install Termux
1. Open your browser on Android.
2. Install Termux from one of these:
    - F-Droid: https://f-droid.org/en/packages/com.termux/
    - Play Store: https://play.google.com/store/apps/details?id=com.termux
3. Open Termux once to initialize.

## Copy the project to your phone
- Option A: Use Termux `git clone` (if you hosted this repo yourself).
- Option B: Use any file manager to copy this folder to Termux's home directory (`/data/data/com.termux/files/home/edge-ai`).
- Option C: Use `termux-setup-storage` and place it in your shared storage, then `cd` there.

## One-time setup in Termux
1. Update packages and install basics
```
pkg update -y && pkg upgrade -y
pkg install -y python git curl
```
2. Install Ollama for Android (Termux)
- Follow the official instructions for Termux builds. If available, the quick path is:
```
curl -fsSL https://ollama.com/install.sh | sh
```
If the above install script changes, please refer to the Ollama docs.

3. Move into the project folder (adjust path if different)
```
cd ~/edge-ai
```

4. Install Python dependencies
```
pip install --no-cache-dir -r backend/requirements.txt
```

5. Start Ollama service (first time only it will pull a model later)
```
nohup ollama serve >/dev/null 2>&1 &
```

6. Pull a small model to test (recommended: tinyllama)
```
ollama pull tinyllama
```
You can also pull other models, e.g. `llama3`, `mistral`, `phi3`, depending on your device's memory.

## Start the app (Termux)
- Easiest way:
```
bash ./start.sh
```
This will:
- Ensure Python deps are installed
- Start Ollama service if needed
- Pull `tinyllama` if no models exist yet
- Start the Flask server on http://0.0.0.0:5000

- Manual way:
```
export FLASK_HOST=0.0.0.0
export FLASK_PORT=5000
export OLLAMA_HOST=127.0.0.1
export OLLAMA_PORT=11434
python -m flask --app backend.app run --host "$FLASK_HOST" --port "$FLASK_PORT"
```

## Preview on Windows (optional)
1. Install Python 3.10+ and Ollama for Windows.
2. In PowerShell, from the project folder:
```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
./start.ps1
```
Visit http://127.0.0.1:5000

## Use it
1. On your Android phone, open your browser (e.g., Chrome) and visit:
    - http://localhost:5000
2. Select a model in the top-right dropdown.
3. Type a message and press Enter or tap Send.
4. Toggle dark/light mode with the switch.
5. Save and load chat history with the buttons; data is stored locally (localStorage).

## Troubleshooting
- If the status shows "Disconnected":
   - Make sure `ollama serve` is running: `pgrep -f "ollama serve"` or just run `nohup ollama serve &`.
   - Verify the API: `curl http://127.0.0.1:11434/api/version` should return a version JSON.
- If the dropdown is empty:
   - Run `ollama pull tinyllama` or another model, then tap the refresh ↻ button.
- For logs, check `logs.txt` in the project root.

## Offline mode
After you install Termux, Python, and the models you want, everything is local. No external CDNs or online assets are used by the UI.

## Notes
- Some larger models may not fit in memory on phones. Start with small ones like `tinyllama`.
- You can change the default port by setting `FLASK_PORT` before running.
- The API supports basic options (temperature, seed) via `/api/chat` JSON if you extend the UI.

<<<<<<< HEAD
# Edge-ai
=======
# Offline AI Chat (Android Termux + Flask + Ollama)

A self-contained, offline chat UI that runs on Android using Termux and local Ollama models. No cloud. No trackers. Just your phone.

## Folder structure

```
edge-ai/
├─ backend/
│  ├─ app.py               # Flask app serving API and static frontend
│  └─ requirements.txt     # Python dependencies (Flask + requests)
├─ frontend/
│  ├─ index.html           # Mobile-first chat UI
│  ├─ styles.css           # Local styles (dark/light)
│  └─ app.js               # Local JS logic (chat, models, storage)
├─ start.sh                # One-touch starter for Termux
└─ logs.txt                # Created at runtime for basic logging
```

## What you need
- An Android phone (ARM64 works best)
- Termux (from F-Droid or Play Store)
- Internet only for the initial installation and model download

## Install Termux
1. Open your browser on Android.
2. Install Termux from one of these:
   - F-Droid: https://f-droid.org/en/packages/com.termux/
   - Play Store: https://play.google.com/store/apps/details?id=com.termux
3. Open Termux once to initialize.

## Copy the project to your phone
- Option A: Use Termux `git clone` (if you hosted this repo yourself).
- Option B: Use any file manager to copy this folder to Termux's home directory (`/data/data/com.termux/files/home/edge-ai`).
- Option C: Use `termux-setup-storage` and place it in your shared storage, then `cd` there.

## One-time setup in Termux
1. Update packages and install basics
```
pkg update -y && pkg upgrade -y
# Edge-ai

Offline AI Chat (Android Termux + Flask + Ollama)

A self-contained, offline chat UI that runs on Android using Termux and local Ollama models. No cloud. No trackers. Just your phone.

## Folder structure

```
edge-ai/
├─ backend/
│  ├─ app.py               # Flask app serving API and static frontend
│  └─ requirements.txt     # Python dependencies (Flask + requests)
├─ frontend/
│  ├─ index.html           # Mobile-first chat UI
│  ├─ styles.css           # Local styles (dark/light)
│  └─ app.js               # Local JS logic (chat, models, storage)
├─ start.sh                # One-touch starter for Termux
└─ logs.txt                # Created at runtime for basic logging
```

## What you need
- An Android phone (ARM64 works best)
- Termux (from F-Droid or Play Store)
- Internet only for the initial installation and model download

## Install Termux
1. Open your browser on Android.
2. Install Termux from one of these:
   - F-Droid: https://f-droid.org/en/packages/com.termux/
   - Play Store: https://play.google.com/store/apps/details?id=com.termux
3. Open Termux once to initialize.

## Copy the project to your phone
- Option A: Use Termux `git clone` (if you hosted this repo yourself).
- Option B: Use any file manager to copy this folder to Termux's home directory (`/data/data/com.termux/files/home/edge-ai`).
- Option C: Use `termux-setup-storage` and place it in your shared storage, then `cd` there.

## One-time setup in Termux
1. Update packages and install basics
```
pkg update -y && pkg upgrade -y
pkg install -y python git curl
```
2. Install Ollama for Android (Termux)
- Follow the official instructions for Termux builds. If available, the quick path is:
```
curl -fsSL https://ollama.com/install.sh | sh
```
If the above install script changes, please refer to the Ollama docs.

3. Move into the project folder (adjust path if different)
```
cd ~/edge-ai
```

4. Install Python dependencies
```
pip install --no-cache-dir -r backend/requirements.txt
```

5. Start Ollama service (first time only it will pull a model later)
```
nohup ollama serve >/dev/null 2>&1 &
```

6. Pull a small model to test (recommended: tinyllama)
```
ollama pull tinyllama
```
You can also pull other models, e.g. `llama3`, `mistral`, `phi3`, depending on your device's memory.

## Start the app
- Easiest way:
```
bash ./start.sh
```
This will:
- Ensure Python deps are installed
- Start Ollama service if needed
- Pull `tinyllama` if no models exist yet
- Start the Flask server on http://0.0.0.0:5000

- Manual way:
```
export FLASK_HOST=0.0.0.0
export FLASK_PORT=5000
export OLLAMA_HOST=127.0.0.1
export OLLAMA_PORT=11434
python -m flask --app backend.app run --host "$FLASK_HOST" --port "$FLASK_PORT"
```

## Use it
1. On your Android phone, open your browser (e.g., Chrome) and visit:
   - http://localhost:5000
2. Select a model in the top-right dropdown.
3. Type a message and press Enter or tap Send.
4. Toggle dark/light mode with the switch.
5. Save and load chat history with the buttons; data is stored locally (localStorage).

## Troubleshooting
- If the status shows "Disconnected":
  - Make sure `ollama serve` is running: `pgrep -f "ollama serve"` or just run `nohup ollama serve &`.
  - Verify the API: `curl http://127.0.0.1:11434/api/version` should return a version JSON.
- If the dropdown is empty:
  - Run `ollama pull tinyllama` or another model, then tap the refresh ↻ button.
- For logs, check `logs.txt` in the project root.

## Offline mode
After you install Termux, Python, and the models you want, everything is local. No external CDNs or online assets are used by the UI.

## Notes
- Some larger models may not fit in memory on phones. Start with small ones like `tinyllama`.
- You can change the default port by setting `FLASK_PORT` before running.
- The API supports basic options (temperature, seed) via `/api/chat` JSON if you extend the UI.
