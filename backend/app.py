import os
import re
import json
import shutil
import logging
from datetime import datetime
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
import requests

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend')
LOG_FILE = os.path.join(BASE_DIR, 'logs.txt')
DEFAULT_SAVE_DIR = os.environ.get('SAVE_DIR') or os.path.join(BASE_DIR, 'saves')

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE, encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

OLLAMA_HOST = os.environ.get('OLLAMA_HOST', '127.0.0.1')
OLLAMA_PORT = int(os.environ.get('OLLAMA_PORT', '11434'))
OLLAMA_URL = f"http://{OLLAMA_HOST}:{OLLAMA_PORT}"

def _ensure_dir(path: str) -> str:
    try:
        Path(path).mkdir(parents=True, exist_ok=True)
        return str(Path(path).resolve())
    except Exception:
        return path


def _safe_filename(name: str) -> str:
    name = name.strip() or 'chat'
    name = re.sub(r'[^a-zA-Z0-9._-]+', '_', name)
    return name[:120]


def create_app():
    app = Flask(
        __name__,
        static_folder=FRONTEND_DIR,
        static_url_path=''
    )

    # In-memory setting for save directory (persisted by environment or default)
    app.config['SAVE_DIR'] = _ensure_dir(DEFAULT_SAVE_DIR)

    # ---------- Static frontend ----------
    @app.route('/')
    def index():
        return send_from_directory(FRONTEND_DIR, 'index.html')

    # ---------- API Endpoints ----------
    @app.get('/api/health')
    def health():
        """Simple health + connectivity check to Ollama."""
        try:
            r = requests.get(f"{OLLAMA_URL}/api/version", timeout=2)
            r.raise_for_status()
            data = r.json()
            return jsonify({
                'status': 'ok',
                'ollama': {
                    'connected': True,
                    'version': data.get('version')
                }
            })
        except Exception as e:
            logger.warning(f"/api/health: Ollama not reachable: {e}")
            return jsonify({
                'status': 'degraded',
                'ollama': {
                    'connected': False,
                    'error': str(e)
                }
            }), 503

    @app.get('/api/models')
    def list_models():
        """List available Ollama models."""
        try:
            r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=10)
            r.raise_for_status()
            data = r.json() or {}
            models = [m.get('name') for m in data.get('models', []) if m.get('name')]
            logger.info(f"/api/models -> {len(models)} models")
            return jsonify({'models': models})
        except Exception as e:
            logger.error(f"/api/models error: {e}")
            return jsonify({'error': 'Failed to fetch models', 'details': str(e)}), 502

    @app.post('/api/chat')
    def chat():
        """Accepts { prompt, model?, system?, temperature?, seed?, messages? } and queries Ollama."""
        payload = request.get_json(silent=True) or {}
        prompt = payload.get('prompt', '').strip()
        model = payload.get('model')
        system = payload.get('system')
        temperature = payload.get('temperature')
        seed = payload.get('seed')
        messages = payload.get('messages')  # optional chat history [{role, content}]

        if not prompt and not (messages and isinstance(messages, list)):
            return jsonify({'error': 'Missing prompt or messages'}), 400

        if not model:
            # Fallback: try to pick the first available model
            try:
                r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
                r.raise_for_status()
                data = r.json() or {}
                models = [m.get('name') for m in data.get('models', []) if m.get('name')]
                if models:
                    model = models[0]
            except Exception:
                pass

        if not model:
            return jsonify({'error': 'No model specified and none found. Pull a model in Ollama first.'}), 400

        try:
            # Prefer /api/chat for better context handling
            chat_body = {
                'model': model,
                'stream': False
            }

            if messages and isinstance(messages, list):
                chat_body['messages'] = messages
            else:
                chat_body['messages'] = [
                    {'role': 'system', 'content': system} if system else None,
                    {'role': 'user', 'content': prompt}
                ]
                chat_body['messages'] = [m for m in chat_body['messages'] if m]

            if temperature is not None:
                chat_body['options'] = chat_body.get('options', {})
                chat_body['options']['temperature'] = temperature
            if seed is not None:
                chat_body['options'] = chat_body.get('options', {})
                chat_body['options']['seed'] = seed

            logger.info(f"/api/chat -> model={model} msgs={len(chat_body['messages'])}")

            r = requests.post(f"{OLLAMA_URL}/api/chat", json=chat_body, timeout=120)
            r.raise_for_status()
            data = r.json() or {}

            # Ollama chat response typically has {message: {role, content}}
            message = data.get('message', {})
            reply = message.get('content', '')

            # Fallback: Some versions might return combined 'content'
            if not reply:
                reply = data.get('content', '')

            return jsonify({
                'model': model,
                'reply': reply,
                'created_at': datetime.utcnow().isoformat() + 'Z'
            })
        except requests.HTTPError as http_err:
            status_code = http_err.response.status_code if http_err.response else 502
            text = http_err.response.text if http_err.response else str(http_err)
            logger.error(f"/api/chat HTTP error {status_code}: {text}")
            return jsonify({'error': 'Ollama HTTP error', 'status': status_code, 'details': text}), 502
        except Exception as e:
            logger.exception("/api/chat unexpected error")
            return jsonify({'error': 'Failed to contact Ollama', 'details': str(e)}), 502

    # ---------- Storage management endpoints ----------
    @app.get('/api/storage')
    def get_storage_info():
        save_dir = app.config.get('SAVE_DIR')
        try:
            entries = []
            p = Path(save_dir)
            if p.exists():
                for f in p.glob('*.json'):
                    entries.append({
                        'name': f.name,
                        'size': f.stat().st_size,
                        'modified': datetime.utcfromtimestamp(f.stat().st_mtime).isoformat() + 'Z'
                    })
            return jsonify({'save_dir': save_dir, 'files': sorted(entries, key=lambda x: x['modified'], reverse=True)})
        except Exception as e:
            return jsonify({'save_dir': save_dir, 'files': [], 'error': str(e)}), 200

    @app.post('/api/storage/dir')
    def set_storage_dir():
        data = request.get_json(silent=True) or {}
        new_dir = data.get('path')
        if not new_dir:
            return jsonify({'error': 'path is required'}), 400
        # Limit to safe locations: within project or under home directory
        try:
            new_path = Path(new_dir).expanduser()
            # Create and resolve
            new_abs = _ensure_dir(str(new_path))
            app.config['SAVE_DIR'] = new_abs
            return jsonify({'save_dir': new_abs})
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    @app.post('/api/storage/save')
    def save_chat_file():
        data = request.get_json(silent=True) or {}
        name = _safe_filename(data.get('name') or datetime.utcnow().strftime('%Y%m%d_%H%M%S'))
        content = data.get('content')
        if content is None:
            return jsonify({'error': 'content is required'}), 400
        save_dir = Path(app.config.get('SAVE_DIR'))
        try:
            save_dir.mkdir(parents=True, exist_ok=True)
            path = save_dir / f"{name}.json"
            with path.open('w', encoding='utf-8') as f:
                json.dump(content, f, ensure_ascii=False, indent=2)
            return jsonify({'saved': True, 'file': str(path)})
        except Exception as e:
            logger.error(f"save_chat_file error: {e}")
            return jsonify({'error': 'failed to save', 'details': str(e)}), 500

    @app.post('/api/storage/read')
    def read_chat_file():
        data = request.get_json(silent=True) or {}
        name = data.get('name')
        if not name:
            return jsonify({'error': 'name is required'}), 400
        save_dir = Path(app.config.get('SAVE_DIR'))
        path = save_dir / name
        try:
            with path.open('r', encoding='utf-8') as f:
                content = json.load(f)
            return jsonify({'ok': True, 'content': content})
        except Exception as e:
            return jsonify({'error': 'failed to read', 'details': str(e)}), 404

    return app

app = create_app()

if __name__ == '__main__':
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', '5000'))
    logger.info(f"Starting Flask server on http://{host}:{port} (serving {FRONTEND_DIR})")
    app.run(host=host, port=port)
