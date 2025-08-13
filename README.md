# Kai Pulla 🤖✨

*Your AI companion that lives in your pocket, no internet required.*

**What if you could have intelligent conversations without being tracked, monitored, or charged per message?**

Meet **Kai Pulla** - the rebellious AI chat that breaks free from the cloud. While others spy on your conversations and drain your wallet, Kai Pulla runs entirely on *your* device, speaks in *your* language, and respects *your* privacy.

## 🔥 Why Kai Pulla Changes Everything

**The Problem:** Every AI chat you use today sends your private thoughts to distant servers, builds a profile on you, and makes money from your data. Your most intimate questions, creative ideas, and personal struggles become their product.

**The Solution:** Kai Pulla runs 100% offline. Your conversations never leave your device. No tracking. No subscriptions. No data harvesting. Just pure, private AI intelligence in your pocket.

### 🚀 What Makes This Special

- **🔒 Fort Knox Privacy** - Your chats never touch the internet
- **📱 Pocket-Sized Genius** - Runs on Android via Termux (even old phones!)
- **⚡ Lightning Fast** - No network delays, instant responses
- **🎨 Beautiful Interface** - Mobile-first design that doesn't suck
- **💰 Completely Free** - No subscriptions, no limits, no BS
- **🌙 Works Anywhere** - Underground bunker? Desert island? Your data stays with you.

## 🎯 Perfect For

- **Privacy Advocates** who refuse to be the product
- **Developers** building the next big thing in secret
- **Students** who need help without judgment
- **Writers** exploring controversial topics
- **Anyone** who believes privacy is a right, not a privilege

## 📂 What's Inside

```
kai-pulla/
├─ backend/
│  ├─ app.py               # 🧠 The AI brain (Flask API)
│  └─ requirements.txt     # 📋 Python magic ingredients
├─ frontend/
│  ├─ index.html           # 🎨 Beautiful chat interface
│  ├─ styles.css           # ✨ Mobile-first styling
│  └─ app.js               # ⚡ Smooth interactions
├─ start.sh                # 🚀 One-tap Android launcher
├─ start.ps1               # 💻 Windows preview script
└─ logs.txt                # 📊 Debug breadcrumbs
```

## ⚡ Quick Start (The Easy Way)

**Got 5 minutes? Let's get you chatting with AI privately:**

### 📱 On Android (The Main Event)

1. **Get Termux** (Your gateway to freedom)
   - F-Droid: https://f-droid.org/en/packages/com.termux/ (Recommended)
   - Play Store: https://play.google.com/store/apps/details?id=com.termux

2. **Clone Your Freedom**
   ```bash
   pkg update && pkg upgrade -y
   pkg install -y python git curl
   git clone https://github.com/smdhussain06/Edge-ai.git
   cd Edge-ai
   ```

3. **Install the AI Engine**
   ```bash
   curl -fsSL https://ollama.com/install.sh | sh
   ```

4. **Launch Into Orbit** 🚀
   ```bash
   bash ./start.sh
   ```

5. **Start Chatting**
   - Open your browser → `http://localhost:5000`
   - Pick your AI model (we recommend `tinyllama` for speed)
   - Ask anything. Nobody's watching. 😎

### 💻 Windows Preview (Test Drive)

Want to try before committing? Here's your playground:

1. Install [Python](https://python.org) and [Ollama for Windows](https://ollama.com/download/windows)
2. Clone this repo
3. Open PowerShell in the project folder:
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
   ./start.ps1
   ```
4. Visit `http://127.0.0.1:5000` - boom! 💥## Use it
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

## 🎨 Experience the Interface

**This isn't your typical boring AI chat.** Kai Pulla features:

- **🌙 Gorgeous Dark Mode** - Easy on the eyes, perfect for late-night brainstorming
- **☀️ Clean Light Mode** - Professional look for daytime productivity  
- **📱 Mobile-First Design** - Thumb-friendly buttons, smooth scrolling, zero frustration
- **🎯 Smart Features** - Auto-save conversations, model switching, instant responses
- **🎨 Portfolio Colors** - Orange accents that pop, blue depths that inspire

## 🔧 Choose Your AI Brain

**Tiny but Mighty:**
- `smollm:135m` - Ultra-fast, 91MB, perfect for quick questions
- `tinyllama` - 637MB, great balance of size and intelligence

**Powerhouse Options:**
- `llama3` - The gold standard (if your device can handle it)
- `mistral` - European excellence in AI
- `phi3` - Microsoft's compact genius

*Pro tip: Start small, upgrade when you're addicted.* 😉

## 🚨 When Things Go Sideways

**Status shows "Disconnected"?**
- Ollama might be sleeping: `ollama serve &`
- Check the heartbeat: `curl http://127.0.0.1:11434/api/version`

**Empty model dropdown?**
- Pull an AI brain: `ollama pull tinyllama`
- Hit that refresh button ↻

**App won't start?**
- Check the breadcrumbs in `logs.txt`
- Ensure Python and Flask are happy: `pip install flask requests`

## 🌍 Join the Revolution

**This is bigger than just another chat app.** Kai Pulla represents a movement toward digital sovereignty. Every person running their own AI is a vote against surveillance capitalism.

**Spread the word.** Share with friends who value privacy. Fork the code. Make it better. This is how we change the world - one private conversation at a time.

## 💡 What's Next?

- 🔊 **Voice conversations** (speak to your AI)
- 🎨 **Custom themes** (make it yours)
- 📁 **File uploads** (analyze documents privately)
- 🔌 **Plugin system** (extend capabilities)
- 🌐 **Multi-language** (AI for everyone)

---

## ❤️ Built with Love

*Created by developers who believe privacy isn't dead - it's just sleeping.*

**Star this repo** if Kai Pulla gave you back control of your conversations.

**Share your story** - how did private AI change your digital life?

---

*"The best AI is the one that serves you, not the other way around."* - Kai Pulla Philosophy
