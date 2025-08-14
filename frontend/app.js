'use strict';

const $ = (sel) => document.querySelector(sel);
const chatEl = $('#chat');
const promptEl = $('#prompt');
const sendBtn = $('#send');
const saveBtn = $('#save');
const loadBtn = $('#load');
const clearBtn = $('#clear');
const modelSelect = $('#modelSelect');
const refreshModelsBtn = $('#refreshModels');
const statusEl = $('#status');
const darkToggle = $('#darkToggle');
const storageBtn = $('#storageBtn');
const storagePanel = $('#storagePanel');
const closeStorage = $('#closeStorage');
const currentDirEl = $('#currentDir');
const newDirEl = $('#newDir');
const changeDirBtn = $('#changeDirBtn');
const filenameEl = $('#filename');
const saveFileBtn = $('#saveFileBtn');
const fileListEl = $('#fileList');

const STORAGE_KEY = 'offline_chat_history_v1';
const THEME_KEY = 'offline_chat_theme';
const MODEL_KEY = 'offline_chat_model';

function setStatus(good, text) {
  statusEl.textContent = text || (good ? 'Connected' : 'Disconnected');
  statusEl.classList.toggle('good', !!good);
  statusEl.classList.toggle('bad', !good);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function addMessage(role, content) {
  const msg = document.createElement('div');
  msg.className = 'msg';
  msg.innerHTML = `
    <div class="avatar">${role === 'user' ? 'U' : 'A'}</div>
    <div class="body">
      <div class="role">${role === 'user' ? 'You' : 'Assistant'}</div>
      <div class="content">${escapeHtml(content)}</div>
    </div>
  `;
  chatEl.appendChild(msg);
  chatEl.scrollTop = chatEl.scrollHeight;
}

async function healthCheck() {
  try {
    const r = await fetch('/api/health');
    if (!r.ok) throw new Error('bad');
    const data = await r.json();
    const ok = data?.ollama?.connected;
    setStatus(ok, ok ? `Connected (Ollama ${data?.ollama?.version || ''})` : 'Disconnected');
  } catch {
    setStatus(false, 'Disconnected');
  }
}

async function loadModels() {
  modelSelect.innerHTML = '';
  const opt = document.createElement('option');
  opt.value = '';
  opt.textContent = 'Loading...';
  modelSelect.appendChild(opt);
  try {
    const r = await fetch('/api/models');
    const data = await r.json();
    modelSelect.innerHTML = '';
    const models = data?.models || [];
    if (!models.length) {
      const o = document.createElement('option');
      o.value = '';
      o.textContent = 'No models found';
      modelSelect.appendChild(o);
      return;
    }
    for (const m of models) {
      const o = document.createElement('option');
      o.value = m;
      o.textContent = m;
      modelSelect.appendChild(o);
    }
    const saved = localStorage.getItem(MODEL_KEY);
    if (saved && models.includes(saved)) {
      modelSelect.value = saved;
    }
  } catch (e) {
    modelSelect.innerHTML = '';
    const o = document.createElement('option');
    o.value = '';
    o.textContent = 'Failed to load models';
    modelSelect.appendChild(o);
  }
}

function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function renderHistory() {
  chatEl.innerHTML = '';
  for (const m of getHistory()) {
    addMessage(m.role, m.content);
  }
}

function saveHistory() {
  const msgs = [...chatEl.querySelectorAll('.msg')].map((node) => {
    const role = node.querySelector('.role').textContent === 'You' ? 'user' : 'assistant';
    const content = node.querySelector('.content').textContent;
    return { role, content };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  darkToggle.checked = theme !== 'light';
}

// ---------- Storage helpers ----------
async function fetchStorageInfo() {
  const r = await fetch('/api/storage');
  if (!r.ok) throw new Error('Failed to load storage info');
  return r.json();
}

async function setStorageDir(path) {
  const r = await fetch('/api/storage/dir', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || 'Failed to set dir');
  return data;
}

async function saveChatToFile(name, content) {
  const r = await fetch('/api/storage/save', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, content })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || 'Failed to save file');
  return data;
}

async function readChatFile(name) {
  const r = await fetch('/api/storage/read', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || 'Failed to read file');
  return data?.content;
}

function openStoragePanel() {
  storagePanel.setAttribute('aria-hidden', 'false');
  loadStoragePanel();
}
function closeStoragePanel() {
  storagePanel.setAttribute('aria-hidden', 'true');
}

async function loadStoragePanel() {
  try {
    const info = await fetchStorageInfo();
    currentDirEl.textContent = info.save_dir || '';
    fileListEl.innerHTML = '';
    (info.files || []).forEach(f => {
      const li = document.createElement('li');
      const name = f.name;
      li.innerHTML = `
        <button class="open" title="Open">Open</button>
        <span class="file-name">${escapeHtml(name)}</span>
        <span class="meta">${Math.round((f.size||0)/1024)} KB • ${new Date(f.modified).toLocaleString()}</span>
      `;
      li.querySelector('.open').addEventListener('click', async () => {
        try {
          const content = await readChatFile(name);
          if (Array.isArray(content)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
            renderHistory();
          }
        } catch (e) {
          alert(e.message || e);
        }
      });
      fileListEl.appendChild(li);
    });
  } catch (e) {
    currentDirEl.textContent = 'Error loading storage info';
  }
}

// Save current chat history to file
async function handleSaveFile() {
  try {
    const name = (filenameEl.value || '').trim();
    const msgs = getHistory();
    await saveChatToFile(name, msgs);
    filenameEl.value = '';
    await loadStoragePanel();
    alert('Saved');
  } catch (e) { alert(e.message || e); }
}

async function sendPrompt() {
  const text = promptEl.value.trim();
  if (!text) return;
  const model = modelSelect.value || undefined;

  addMessage('user', text);
  promptEl.value = '';
  saveHistory();

  try {
    const messages = getHistory();
    const body = { model, messages };
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data?.error || 'Chat failed');
    addMessage('assistant', data.reply || '(no reply)');
    saveHistory();
  } catch (e) {
    addMessage('assistant', `Error: ${e.message || e}`);
  }
}

// Events
sendBtn.addEventListener('click', sendPrompt);
promptEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendPrompt();
  }
});
saveBtn.addEventListener('click', saveHistory);
loadBtn.addEventListener('click', renderHistory);
clearBtn.addEventListener('click', () => { chatEl.innerHTML = ''; saveHistory(); });
refreshModelsBtn.addEventListener('click', () => { loadModels(); healthCheck(); });
modelSelect.addEventListener('change', () => localStorage.setItem(MODEL_KEY, modelSelect.value));
darkToggle.addEventListener('change', () => setTheme(darkToggle.checked ? 'dark' : 'light'));
storageBtn.addEventListener('click', openStoragePanel);
closeStorage.addEventListener('click', closeStoragePanel);
changeDirBtn.addEventListener('click', async () => {
  const p = newDirEl.value.trim();
  if (!p) return;
  try { await setStorageDir(p); newDirEl.value=''; await loadStoragePanel(); }
  catch (e) { alert(e.message || e); }
});
saveFileBtn.addEventListener('click', handleSaveFile);

// Init
(function init() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  setTheme(savedTheme);
  darkToggle.checked = savedTheme !== 'light';
  renderHistory();
  loadModels();
  healthCheck();
  setInterval(healthCheck, 5000);
})();
