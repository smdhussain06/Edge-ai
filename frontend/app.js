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
